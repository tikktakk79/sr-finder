import storageApi from "@/services/StorageService.js"

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
          console.log(error)
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
  userEpisodes(user) {
    console.log("From storage calls: GETTING EPISODES")
    console.log("the token is:", localStorage.getItem("user-token"))
    console.log("User from userEpisodes in storagecalls", user)
    return storageApi
      .post("/episode/external", {
        username: user,
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
  saveEpisode(
    id,
    title = null,
    show_name = null,
    show_id = null,
    description,
    url = null,
    pub_date = null,
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
}

export default storageCalls
