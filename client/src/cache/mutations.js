import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email 
			_id
			name
			password
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!, $name: String!) {
		register(email: $email, password: $password, name: $name) {
			email
			password
			name
		}
	}
`;
export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

export const UPDATE = gql`
	mutation Update($email: String!, $password: String!, $name: String!) {
		update(email: $email, password: $password, name: $name) {
			email
			password
			name
		}
	}
`;

export const ADD_MAP = gql`
	mutation AddMap($map: MapInput!) {
		addMap(map: $map) 
	}
`;

export const EDIT_MAP = gql`
	mutation EditMap($_id: String!, $name: String!) {
		editMap(_id: $_id, name: $name)
	}
`;

export const DELETE_MAP = gql`
	mutation DeleteMap($_id: String!) {
		deleteMap(_id: $_id)
	}
`;

export const ADD_REGION = gql`
	mutation AddRegion($region: RegionInput!, $_id: String!, $index: Int!) {
		addRegion(region: $region, _id: $_id, index: $index)
	}
`;

export const DELETE_REGION = gql`
	mutation DeleteRegion($regionId: String!, $_id: String!) {
		deleteRegion(regionId: $regionId, _id: $_id) {
			_id
			id
			name
			capital
			leader
			landmarks
		}
	}
`;

export const UPDATE_REGION_FIELD = gql`
	mutation UpdateRegionField($regionId: String!, $_id: String!, $field: String!, $value: String!) {
		updateRegionField(regionId: $regionId, _id: $_id, field: $field, value: $value) {
			_id
			id
			name
			capital
			leader
			landmarks
		}
	}
`;

export const SORT_COLUMN = gql`
	mutation SortColumn($_id: String!, $field: String!, $direction: Int!) {
		sortColumn(_id: $_id, field: $field, direction: $direction) {
			_id
			id
			name
			capital
			leader
			landmarks
		}
	}
`;