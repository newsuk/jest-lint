const React = require("react");
const { StyleSheet, Text } = require("react-native");
const TestRenderer = require("react-test-renderer");
const {
  addSerializers,
  hoistStyle
} = require("@times-components/jest-serializer");

it("1. snapshot for style block", () => {
  addSerializers(expect, hoistStyle);

  const styles = StyleSheet.create({
    test: {
      color: "blue"
    }
  });

  const testInstance = TestRenderer.create(
    <Text foo="bar" style={styles.test}>
      Some text
    </Text>
  );

  expect(testInstance).toMatchSnapshot();
});
