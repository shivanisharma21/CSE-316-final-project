import { gql } from "@apollo/client";

export const GET_DB_USER = gql`
	query GetDBUser {
		getCurrentUser {
			_id
			name
			email
		}
	}
`;

export const GET_DB_MAPS = gql`
	query GetDBMaps {
		getAllMaps {
			_id
			id
			name
			owner
			regions {
				_id
				id
				name
				capital
				leader
				landmarks
				subregions {
					name
				}
			}
		}
	}
`;