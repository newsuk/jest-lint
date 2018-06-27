const React = require("react");
const { StyleSheet, Text } = require("react-native");
const TestRenderer = require("react-test-renderer");
const {
  addSerializers,
  hoistStyle,
  justChildren,
  replace
} = require("@times-components/jest-serializer");
const styled = require("styled-components").default;
const Enzyme = require("enzyme");
const mount = require("enzyme").mount;
const Adapter = require("enzyme-adapter-react-16");

Enzyme.configure({ adapter: new Adapter() });

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

it("2. snapshot for style block with array", () => {
  addSerializers(
    expect,
    replace({
      div: justChildren,
      Foo: justChildren
    })
  );

  require("jest-styled-components");

  const StyledH1 = styled.h1`
    font-size: 1.5em;
    text-align: center;
    color: palevioletred;
  `;

  const Foo = () => <div>{[<StyledH1 />, <StyledH1 />]}</div>;

  const wrapper = mount(<Foo />);

  expect(wrapper).toMatchSnapshot();
});
