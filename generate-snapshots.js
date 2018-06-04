const React = require("react");
const { View, Text, FlatList } = require("react-native");
const TestRenderer = require("react-test-renderer");

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

const ListComponent = () => (
  <FlatList
    data={data}
    ListHeaderComponent={() => <HeaderComponent />}
    ListFooterComponent={() => <FooterComponent />}
    renderItem={({ item }) => <Text>{item.key}</Text>}
  />
);

const listRenderer = TestRenderer.create(
  <View>
    <ListComponent />
  </View>
);

const renderedObject = TestRenderer.create(
  <View>
    <Text>An error occurred</Text>
    <Text>{JSON.stringify({ prop: "some value" }, null, 2)}</Text>
  </View>
);

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
  }
];

tests.forEach(({ key, value }, indx) =>
  test(`${indx}. snapshot for ${key}`, () => expect(value).toMatchSnapshot())
);
