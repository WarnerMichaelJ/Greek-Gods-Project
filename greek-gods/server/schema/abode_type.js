const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
// const Emblem = mongoose.model("emblem");
const Abode = mongoose.model("abode");

const AbodeType = new GraphQLObjectType({
  name: "AbodeType",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    coordinates: { type: GraphQLString },
    gods: {
      // we are requiring the GodType here inside the thunk
      // to get around the problem of circular dependencies
      type: new GraphQLList(require("./god_type")),
      // we don't need to take in an argument since the Emblem will already have Gods related to it
      resolve(parentValue) {
        // we take advantage of parentValue which in this case is the emblem we are
        // preforming this query on
        return Abode.findById(parentValue.id)
          .populate("gods")
          .then(abode => abode.gods);
      }
    }
  })
});

module.exports = AbodeType;