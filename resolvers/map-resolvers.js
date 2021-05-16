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
		},

		addRegion: async(_, args) => {
			const { _id, region, index } = args;
			const Id = new ObjectId(_id);
			const objectId = new ObjectId();
			const found = await Map.findOne({_id: Id});
			if(!found) return ('Map not found');
			if(region._id === '') region._id = objectId;
			let newRegions = found.regions;
			if(index < 0) newRegions.push(region);
   			else newRegions.splice(index, 0, region);
			
			const updated = await Map.updateOne({_id: Id}, { regions: newRegions });

			if(updated) return (region._id);
			else return ('Could not add region');
		},

		deleteRegion: async (_, args) => {
			const  { _id, regionId } = args;
			const mapId = new ObjectId(_id);
			const found = await Map.findOne({_id: mapId});
			let regions = found.regions;
			regions = regions.filter(region => region._id.toString() !== regionId);
			const updated = await Map.updateOne({_id: mapId}, { regions: regions })
			if(updated) return (regions);
			else return (found.regions);

		},

		updateRegionField: async (_, args) => {
			const { _id, regionId, field } = args;
			let { value } = args
			const mapId = new ObjectId(_id);
			const found = await Map.findOne({_id: mapId});
			let regions = found.regions;

			regions.map(region => {
				if(region._id.toString() === regionId) {	
					
					region[field] = value;
				}
			});
			const updated = await Map.updateOne({_id: mapId}, { regions: regions })
			if(updated) return (regions);
			else return (found.regions);
		},
	}
}