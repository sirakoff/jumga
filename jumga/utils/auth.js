import React, { useState, useEffect, useContext, createContext } from "react";
import nookies from "nookies";
import firebaseClient from "./firebase/client";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import gql from "graphql-tag";

import client from './apollo';

const AuthContext = createContext({});

const ensureUserExists = async (uid, token) => {

	const apollo = client({
		token
	});

	let userId;
	let role;

	// console.log('token: ', token);


	const {data} = await apollo.query({
		query: gql`
			query (
				$firebase_id: String!
			){
				users(where:{
					firebase_id: {_eq: $firebase_id}
				}){
					id
					role
				}
			}
		`,
		variables: {
			firebase_id: uid
		}
	});

	userId = data && data.users && data.users.length ? data.users[0].id: null;
	role = data && data.users && data.users.length ? data.users[0].role: null

	if (data && data.users && !data.users.length) {

		const {data} = await apollo.mutate({
			mutation: gql`
				mutation (
					$firebase_id: String!
				){
					insert_users_one(object: {
						firebase_id: $firebase_id,
						role: "user"
					}) {
						id
						role
					}
				}
			`,
			variables: {
				firebase_id: uid
			}
		});

		userId = data.insert_users_one.id;
		role = data.insert_users_one.role;

	}

	return {
		id: userId,
		role
	};

}

export const AuthProvider = ({ children }) => {
	
	firebaseClient();
	const [user, setUser] = useState(null);

	let metadataRef;


	useEffect(() => {
		
		return firebase.auth().onIdTokenChanged(async (user) => {
			
			console.log("auth changed");
			console.log(user ? user.uid : "Nothing");

			// if (user && !cookies.token) {

			// 	return firebase.auth().signOut();

			// }

			if (!user) {

				setUser(null);

				nookies.destroy(undefined, "token", {
					path: '/',
				});

				return;

			}

			setUser({
				...user,
			});

			const res = await user.getIdTokenResult();
			const {token} = res;

			nookies.set(undefined, "token", token, {
				path: '/',
			});

			const _user = await ensureUserExists(user.uid, token);

			const {role: currentRole} = _user;

			// console.log(res);

			const userRole = res.claims["https://hasura.io/jwt/claims"]["x-hasura-default-role"]

			if (currentRole !== userRole) {

				const res = await user.getIdTokenResult(true);
				const {token} = res;

				nookies.set(undefined, "token", token, {
					path: '/',
				});


			}

			setUser({
				...user,
				..._user
			});

		});

	}, []);

	return (
		<AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);