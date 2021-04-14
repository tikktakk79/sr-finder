import apiSr from "../SrService.js"

const srCalls = {
  searchEpisodes(query) {
    return apiSr.get(
      "/episodes/search/?query=" +
        query +
        "&pagination=true&size=25&format=JSON"
    )
  },
  getPrograms() {
    return apiSr.get("/programs?format=JSON&pagination=false")
  },
  programEpisodes(id) {
    return apiSr.get(
      "/episodes/index?programid=" + id + "&pagination=true&size=25&format=JSON"
    )
  },
  freeQuery(fullAddress) {
    console.log("faddress from apicall", fullAddress)
    let address = fullAddress.replace("http://api.sr.se/api/v2", "")
    return apiSr.get(address)
  }
}

export default srCalls
