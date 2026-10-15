import { readdirSync, readFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import ts from 'typescript';

const root = resolve('src');
const failures = [];
const normalize = (path) => path.replaceAll('\\', '/');
function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      inspect(file);
      continue;
    }
    if (!/\.tsx?$/.test(file) || /\.test\.tsx?$/.test(file)) continue;
    const owner = normalize(relative(root, file));
    const source = ts.createSourceFile(
      file,
      readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
    );
    for (const statement of source.statements) {
      if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) continue;
      if (!statement.moduleSpecifier || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
      const specifier = statement.moduleSpecifier.text;
      if (!specifier.startsWith('@/') && !specifier.startsWith('.')) continue;
      const target = normalize(
        relative(
          root,
          specifier.startsWith('@/')
            ? resolve(root, specifier.slice(2))
            : resolve(dirname(file), specifier),
        ),
      );
      const [layer, feature] = owner.split('/');
      const [targetLayer, targetFeature, ...internal] = target.split('/');
      const fail = (reason) => failures.push(`${owner}: ${reason} (${specifier})`);
      if (layer === 'shared' && targetLayer !== 'shared')
        fail('shared must not depend on app or features');
      if (layer === 'features' && targetLayer === 'app') fail('features must not depend on app');
      if (
        targetLayer === 'features' &&
        (layer !== 'features' || feature !== targetFeature) &&
        internal.length &&
        !/^index(?:\.ts)?$/.test(internal.join('/'))
      ) {
        fail('import other features through their public index.ts');
      }
      if (owner.includes('/pages/') && /^features\/[^/]+\/(services|mocks)\//.test(target))
        fail('pages must obtain data through hooks');
      if (target.includes('/mocks/') && !owner.includes('/services/') && !owner.includes('/mocks/'))
        fail('only services may read mock fixtures');
    }
  }
}
inspect(root);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else console.log('Architecture boundaries passed: app → features → shared.');
