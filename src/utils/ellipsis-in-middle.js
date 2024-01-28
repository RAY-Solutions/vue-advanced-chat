export const ellipsisInMiddle = str => {
	if (str.length > 20) {
		return str.substr(0, 10) + '...' + str.substr(-5)
	}
	return str
}
