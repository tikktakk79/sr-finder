import storageApi from "@/services/StorageService.js"
import router from "../../router"

const storageCalls = {
  loginUser(username, password) {
    return storageApi
      .post("/user/login", {
        username: username,
        password: password,
      })
      .then(
        (response) => {
          console.log("LOGIN RESPONSE", response)
          response.data.username = username
          return response.data
        },
        (error) => {
          console.log("De bidde fel")
          console.log("Felet:", error)
          let errorStatus = error.response.data.statusText
          let errorMessage = ""

          if (errorStatus === "No match for user in database") {
            errorMessage =
              "Ingen användare finns registrerad med det användarnamnet"
          } else if (errorStatus === "User not verified") {
            errorMessage =
              "Användaren är ännu inte aktiverad. Du ska ha fått en länk för aktivering till din mail."
          } else if (errorStatus === "Current password does not match") {
            errorMessage = "Du har angivit ett felaktigt lösenord"
          }
          router.push({
            name: "Error",
            params: { message: errorMessage },
          })
          throw error
        }
      )
  },
  createUser(username, password, firstname, lastname, email) {
    return storageApi
      .post("/user", {
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
        email: email,
      })
      .then(
        (response) => {
          console.log(response)
          return response.data
        },
        (error) => {
          console.log("De bidde fel i registreringen")
          console.log(error)
          throw error
        }
      )
  },

  searchUser(username, firstname, lastname, email) {
    return storageApi
      .get(
        "/user/search?firstname=" +
          firstname +
          "&username=" +
          username +
          "&lastname=" +
          lastname +
          "&email=" +
          email
      )
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

  getUserData() {
    return storageApi.get("/user/data").then(
      (resp) => {
        return resp
      },
      (err) => console.log(err)
    )
  },

  updateUser(firstname, lastname, email) {
    return storageApi
      .post("/user/update", {
        firstname,
        lastname,
        email,
      })
      .then(
        (resp) => {
          console.log("Svar från updateUser", resp)
          return resp
        },
        (err) => {
          console.log("Sorry kunde ej uppdatera användardata", err)
          throw err
        }
      )
  },

  changePassword(password, newPassword) {
    return storageApi
      .post("/user/password", {
        password,
        newPassword,
      })
      .then(
        (resp) => {
          console.log("Svar från updateUser", resp)
          return resp
        },
        (err) => {
          console.log("Kunde ej byta lösenord", err)
          throw err
        }
      )
  },

  getEpisodes() {
    console.log("From storage calls: GETTING EPISODES")
    console.log("the token is:", localStorage.getItem("user-token"))
    return storageApi.get("/episode").then(
      (response) => {
        console.log("RESPONSE", response)
        return response.data
      },
      (error) => {
        console.log("ERR in storage calls get episodes")
        console.log("ERROR", error)
        throw error
      }
    )
  },
  getUserEpisodes(username) {
    console.log("From storage calls: GETTING EPISODES")
    console.log("the token is:", localStorage.getItem("user-token"))
    return storageApi
      .post("/friend/episode", {
        username: username,
      })
      .then(
        (response) => {
          console.log("RESPONSE", response)
          return response.data
        },
        (error) => {
          console.log("ERR in storage calls get episodes")
          console.log("ERROR", error)
          throw error
        }
      )
  },

  saveEpisode(
    id,
    title = null,
    show_name = null,
    show_id = null,
    description,
    url = null,
    pub_date = null,
    listen_link = null,
    grade = null
  ) {
    return storageApi
      .post("/episode", {
        episode_id: id,
        title,
        show_name,
        show_id,
        description,
        url,
        listen_link,
        pub_date,
        grade,
      })
      .then(
        (resp) => {
          console.log("Avnitt sparat och kirrat", resp)
          return resp
        },
        (err) => {
          console.log("Sorry funkante", err)
          throw err
        }
      )
  },
  removeEpisode(episode_id) {
    return storageApi
      .post("/episode/delete", {
        episode_id,
      })
      .then(
        (resp) => {
          console.log("Avsnitt borttaget", resp)
          return resp
        },
        (err) => {
          console.log("Sorry kunde ej ta bort avsnitt", err)
          throw err
        }
      )
  },
  setGrade(episode_id, grade) {
    return storageApi
      .post("/grade", {
        grade,
        episode_id,
      })
      .then(
        (resp) => {
          console.log("Betyg satt", resp)
          return resp
        },
        (err) => {
          console.log("Sorry kunde ej sätta betyg", err)
          throw err
        }
      )
  },
  getPrograms() {
    console.log("From storage calls: GETTING PROGRAMS")
    console.log("the token is:", localStorage.getItem("user-token"))
    return storageApi.get("/program").then(
      (response) => {
        console.log("RESPONSE from getPrograms", response)
        return response.data
      },
      (error) => {
        console.log("ERR in storage calls get programs")
        console.log("ERROR", error)
        throw error
      }
    )
  },
  getUserPrograms(username) {
    console.log("From storage calls: GETTING PROGRAMS")
    console.log("the token is:", localStorage.getItem("user-token"))
    return storageApi
      .post("/friend/program", {
        username: username,
      })
      .then(
        (response) => {
          console.log("RESPONSE from getPrograms", response)
          return response.data
        },
        (error) => {
          console.log("ERR in storage calls get programs")
          console.log("ERROR", error)
          throw error
        }
      )
  },
  gradeProgram(programData) {
    console.log("programData inside StorageCalls", programData)
    return storageApi
      .post("/program", {
        program_id: programData.id,
        program_name: programData.name,
        grade: programData.grade,
      })
      .then(
        (resp) => {
          console.log("Program betygsatt - hälsar StorageCalls", resp)
          return resp
        },
        (err) => {
          console.log("Sorry kunde ej betygsätta program", err)
          throw err
        }
      )
  },
  updateProgram(programId, grade) {
    console.log("programData inside StorageCalls", programId, grade)
    return storageApi
      .post("/program/update", {
        program_id: programId,
        grade: grade,
      })
      .then(
        (resp) => {
          console.log("Programbetyg ändrat - hälsar StorageCalls", resp)
          return resp
        },
        (err) => {
          console.log("Sorry kunde ej ändra betyg för program", err)
          throw err
        }
      )
  },
  deleteProgram(programId) {
    return storageApi
      .post("/program/delete", {
        program_id: programId,
      })
      .then(
        (resp) => {
          console.log("Programbetyg borttaget - hälsar StorageCalls", resp)
          return resp
        },
        (err) => {
          console.log("Sorry kunde ej ta bort betyg för program", err)
          throw err
        }
      )
  },
  sendTip(
    id,
    title = null,
    show_name = null,
    show_id = null,
    description,
    url = null,
    pub_date = null,
    listen_link = null,
    receiver
  ) {
    return storageApi
      .post("/tip", {
        episode_id: id,
        title,
        show_name,
        show_id,
        description,
        url,
        listen_link,
        pub_date,
        username: receiver,
      })
      .then(
        (resp) => {
          console.log("Tips sparat och kirrat", resp)
          return resp
        },
        (err) => {
          console.log("Sorry funkante att lägga in tips", err)
          throw err
        }
      )
  },
  getTips() {
    console.log("From storage calls: GETTING TIPS")
    console.log("the token is:", localStorage.getItem("user-token"))
    return storageApi.get("/tip").then(
      (response) => {
        console.log("TIPS RESPONSE", response)
        return response.data
      },
      (error) => {
        console.log("ERR in storage calls get tips")
        console.log("ERROR", error)
        throw error
      }
    )
  },
  setOldTips() {
    return storageApi.post("/tip/update").then(
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
  removeAllTips() {
    return storageApi.post("/tip/remove-all").then(
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
  removeTip(episodeId, user) {
    return storageApi.post("/tip/remove", { episodeId, user }).then(
      (response) => {
        console.log("Inside removeTip in storageCalls")
        return response
      },
      (error) => {
        console.log("ERROR", error)
        throw error
      }
    )
  },
}

export default storageCalls
