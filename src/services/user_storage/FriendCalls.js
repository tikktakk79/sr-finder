import storageApi from "@/services/StorageService.js"

const friendCalls = {
  getFriends() {
    console.log("From storage calls: GETTING FRIENDS")
    console.log("the token is:", localStorage.getItem("user-token"))
    return storageApi.get("/friend").then(
      (response) => {
        if (response) {
          console.log("RESPONSE", response.data)
          return response.data
        } else {
          return
        }
      },
      (error) => {
        console.log("ERROR", error)
        throw error
      }
    )
  },
  reqFriend(receiver) {
    console.log("From storage calls: GETTING FRIENDS")
    console.log("RECEIVERYR", receiver)
    console.log("the token is:", localStorage.getItem("user-token"))
    return storageApi
      .post("/friend", {
        receiver: receiver,
      })
      .then(
        (response) => {
          console.log("RESPONSE", response.data)
          return response.data
        },
        (error) => {
          console.log("ERROR", error)
          throw error
        }
      )
  },

  acceptFriend(receiver) {
    console.log("From storage calls: GETTING FRIENDS")
    console.log("the token is:", localStorage.getItem("user-token"))
    return storageApi
      .post("/friend/accept", {
        receiver: receiver,
      })
      .then(
        (response) => {
          console.log("RESPONSE", response.data)
          return response.data
        },
        (error) => {
          console.log("ERROR", error)
          throw error
        }
      )
  },
  deleteFriend(receiver) {
    console.log("From storage calls: GETTING FRIENDS")
    console.log("the token is:", localStorage.getItem("user-token"))
    return storageApi
      .post("/friend/delete", {
        receiver: receiver,
      })
      .then(
        (response) => {
          console.log("RESPONSE", response.data)
          return response.rows
        },
        (error) => {
          console.log("ERROR", error)
          throw error
        }
      )
  },
  waitFriend(receiver) {
    console.log("From storage calls: GETTING FRIENDS")
    console.log("the token is:", localStorage.getItem("user-token"))
    return storageApi
      .post("/friend/wait", {
        receiver,
      })
      .then(
        (response) => {
          console.log("RESPONSE", response.data)
          return response.data
        },
        (error) => {
          console.log("ERROR", error)
          throw error
        }
      )
  },
  setOld() {
    return storageApi.post("/friend/update").then(
      (response) => {
        console.log("RESPONSE", response.data)
        return response
      },
      (error) => {
        console.log("ERROR", error)
        throw error
      }
    )
  },
  setSecret(secret) {
    return storageApi
      .post("/secret", {
        secret,
      })
      .then(
        (resp) => {
          console.log("RESPONSE FROM setSecret", resp.data)
          return resp
        },
        (err) => {
          console.log("ERROR", error)
          throw err
        }
      )
  },
  getSecret() {
    return storageApi.get("/secret").then(
      (resp) => {
        console.log("RESPONSE FROM getSECRET", resp.data)
        return resp
      },
      (err) => {
        console.log("ERROR", error)
        throw err
      }
    )
  },
  getTipsMail() {
    return storageApi.get("/tips-mail").then(
      (resp) => {
        console.log("RESPONSE FROM getTipsMail", resp.data)
        return resp
      },
      (err) => {
        console.log("ERROR", error)
        throw err
      }
    )
  },
  setTipsMail(tipsMail) {
    return storageApi
      .post("/tips-mail", {
        tips_mail: tipsMail,
      })
      .then(
        (resp) => {
          console.log("RESPONSE FROM setTipsMail", resp.data)
          return resp
        },
        (err) => {
          console.log("ERROR", error)
          throw err
        }
      )
  },
}

export default friendCalls
