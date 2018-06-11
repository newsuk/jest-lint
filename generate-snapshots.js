const React = require("react");
const { View, Text, FlatList } = require("react-native");
const TestRenderer = require("react-test-renderer");
const styled = require("styled-components").default;
require("jest-styled-components");

const simpleRenderer = TestRenderer.create(
  <View>
    <Text>Hello World!</Text>
  </View>
);

const HeaderComponent = () => (
  <View>
    <Text>top of the list</Text>
  </View>
);

const FooterComponent = () => (
  <View aLongValue="a-very-long-value-that-is-irrelevant-to-snapshotting">
    <Text>bottom of the list</Text>
  </View>
);

const data = [
  { key: "a" },
  { key: "b" },
  { key: "c" },
  { key: "d" },
  { key: "e" },
  { key: "f" },
  { key: "g" }
];

const ListComponent = ({ header }) => (
  <FlatList
    data={data}
    ListHeaderComponent={header}
    ListFooterComponent={() => <FooterComponent />}
    renderItem={({ item }) => <Text>{item.key}</Text>}
  />
);

const listRenderer = TestRenderer.create(
  <View>
    <ListComponent header={<HeaderComponent />} />
  </View>
);

const renderedObject = TestRenderer.create(
  <View>
    <Text>An error occurred</Text>
    <Text>{JSON.stringify({ prop: "some value" }, null, 2)}</Text>
  </View>
);

const StyledH1 = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

const styledObject = TestRenderer.create(<StyledH1 />);

const justAnObject = {
  action: "Viewed",
  attrs: {
    byline:
      "Rosemary Bennett, Education Editor | Nicola Woolcock, Education Correspondent",
    eventTime: "2018-01-01T00:00:00.000Z",
    headline:
      "Caribbean islands devastated by Hurricane Irma, the worst Atlantic storm on record",
    publishedTime: "2015-03-13T18:54:58.000Z",
    topics: [
      {
        name: "Football",
        slug: "football"
      },
      {
        name: "Manchester United FC",
        slug: "manchester-united"
      },
      {
        name: "Chelsea FC",
        slug: "chelsea"
      },
      {
        name: "Arsenal",
        slug: "arsenal"
      },
      {
        name: "Rugby Union",
        slug: "rugby-union"
      }
    ]
  },
  component: "Page",
  object: "Article"
};

const Lengthy = ({ data, long }) => <View data={data} long={long} />;

const LengthTest = props => (
  <View>
    <Lengthy {...props} />
  </View>
);

const lengthTest = TestRenderer.create(
  <LengthTest data={data} long="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" />
);

const arrayOfComponents = TestRenderer.create([
  <Text key="1">One</Text>,
  <Text key="2">Two</Text>,
  <Text key="3">Three</Text>
]);

const tests = [
  {
    key: "primitives",
    value: [
      {
        boolean: true,
        null: null,
        number: 5,
        string: "test",
        symbol: Symbol("test"),
        undef: undefined
      },
      {
        boolean: true,
        null: null,
        number: 5,
        string: "test",
        symbol: Symbol("test"),
        undef: undefined
      }
    ]
  },
  {
    key: "simple-rn-component",
    value: simpleRenderer.toJSON()
  },
  {
    key: "list-rn-component",
    value: listRenderer.toJSON()
  },
  {
    key: "rendered-object",
    value: renderedObject.toJSON()
  },
  {
    key: "just-an-object",
    value: justAnObject
  },
  {
    key: "a-styled-object",
    value: styledObject.toJSON()
  },
  {
    key: "length-tests",
    value: lengthTest.toJSON()
  },
  {
    key: "array-of-components",
    value: arrayOfComponents.toJSON()
  }
];

tests.forEach(({ key, value }, indx) =>
  test(`${indx}. snapshot for ${key}`, () => expect(value).toMatchSnapshot())
);
