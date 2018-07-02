const React = require("react");
const { StyleSheet, Text } = require("react-native");
const TestRenderer = require("react-test-renderer");
const {
  addSerializers,
  compose,
  hoistStyleTransform,
  justChildren,
  replaceTransform,
  stylePrinter
} = require("@times-components/jest-serializer");
const styled = require("styled-components").default;
const Enzyme = require("enzyme");
const mount = require("enzyme").mount;
const Adapter = require("enzyme-adapter-react-16");

Enzyme.configure({ adapter: new Adapter() });

addSerializers(
  expect,
  compose(
    stylePrinter,
    replaceTransform({
      div: justChildren,
      Foo: justChildren
    }),
    hoistStyleTransform
  )
);

require("jest-styled-components");

it("1. snapshot for style block", () => {
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
  const StyledH1 = styled.h1`
    font-size: 1.5em;
    text-align: center;
    color: palevioletred;
  `;

  const Foo = () => <div>{[<StyledH1 key="1" />, <StyledH1 key="2" />]}</div>;

  const wrapper = mount(<Foo />);

  expect(wrapper).toMatchSnapshot();
});

it("3. snapshot for style block and styled components", () => {
  const styles = StyleSheet.create({
    test: {
      color: "blue"
    }
  });

  const StyledH1 = styled.h1`
    font-size: 1.5em;
    text-align: center;
    color: palevioletred;
  `;

  const wrapper = mount(<StyledH1 style={styles.test} />);

  expect(wrapper).toMatchSnapshot();
});
