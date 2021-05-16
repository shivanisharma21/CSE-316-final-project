const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		id: Int!
		name: String!
		owner: String!
		regions: [Region]
	}
	type Region {
		_id: String!
		id: Int!
		name: String!
		capital: String!
		leader: String!
		landmarks:  String!
        
	}
	extend type Query {
		getAllMaps: [Map]
		getMapById(_id: String!): Map 
	}
	extend type Mutation {
		addMap(map: MapInput!): String
		editMap(_id: String!, name: String!) : String
		deleteMap(_id: String!) : Boolean
		addRegion(region: RegionInput!, _id: String!, index: Int!) : String
		deleteRegion(regionId: String!, _id: String!) : [Region]
		updateRegionField(regionId: String!, _id: String!, field: String!, value: String!) : [Region]
	}
	
	input FieldInput {
		_id: String
		field: String
		value: String
	}
	input MapInput {
		_id: String
		id: Int
		name: String
		owner: String
		regions: [RegionInput]
	}
	input RegionInput {
		_id: String
		id: Int
		name: String
		capital: String
		leader: String
		landmarks:  String
        
	}
`;

module.exports = { typeDefs: typeDefs }