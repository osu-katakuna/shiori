module.exports = (body) => {
	const data = body.slice(0).toString().split('\n')
	if(data.length < 3) throw new Error("Malformed login data!")

	const client_data = data[2].split("|")

	return {
		User: data[0],
		Password: data[1],
		ClientBuild: client_data[0],
		TimezoneOffset: client_data[1],
		DisplayCityLocation: client_data[2],
		ClientHash: client_data[3],
		BlockNonFriendPM: client_data[4]
	}
};
