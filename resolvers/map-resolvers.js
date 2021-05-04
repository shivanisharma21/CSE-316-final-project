const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');

// The underscore param, "_", is a wildcard that can represent any value;
// here it is a stand-in for the parent parameter, which can be read about in
// the Apollo Server documentation regarding resolvers

module.exports = {
	Query: {
		/** 
		 	@param 	 {object} req - the request object containing a user id
			@returns {array} an array of map objects on success, and an empty array on failure
		**/
		getAllMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const maps = await Map.find({owner: _id});
			if(maps) return (maps);

		},
		/** 
		 	@param 	 {object} args - a map id
			@returns {object} a map on success and an empty object on failure
		**/
		getMapById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({_id: objectId});
			if(map) return map;
			else return ({});
		},
	},
	Mutation: {
		addMap: async(_, args) => {
			const {map} = args;
			const {id, name, owner, regions} = map;
			const objectId = new ObjectId();
			const newMap = new Map({
				_id: objectId,
				id: id,
				name: name,
				owner: owner,
				regions: regions
			});
			const updated = newMap.save();
			if(updated) return objectId;
			else return ('Could not add map');
		},

		editMap: async (_, args) => {
			const {_id, name} = args;
			const mapId = new ObjectId(_id);
			const updated = await Map.updateOne({_id: mapId}, { name: name });
			if(updated) return (mapId);
			else return ("Could not edit map");
		},

		deleteMap: async (_, args) => {
			const {_id} = args;
			const mapId = new ObjectId(_id);
			const deleted = await Map.deleteOne({_id: mapId});
			if(deleted) return true;
			else return false;
		}
	}
}