import 'package:dut_student_information_mobile/main.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('renders login screen title', (tester) async {
    await tester.pumpWidget(const DutSisApp());
    expect(find.text('DUT Portal Login'), findsOneWidget);
  });
}
