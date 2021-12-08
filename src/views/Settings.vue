<template>
  <div class="text-center">
    <div class="text-center">
      <h1 class="mb-6">Inställningar</h1>
      <div class="text-center">
        <p class="w-52 mb-1 mx-auto">Visa endast betyg för vänner</p>
        <toggle-button
          :value="secret"
          :sync="true"
          @change="Change"
          class="mb-4"
        />
        <p class="w-44 mb-1 mx-auto">
          Skicka mail då jag blir tipsad om avsnitt
        </p>
        <toggle-button
          :value="tipsMail"
          :sync="true"
          @change="changeTipsMail"
          class="mb-4"
        />
      </div>
    </div>

    <div class="flex justify-center">
      <div
        class="border-gray-400 border-2 border-separate px-3 my-5 pt-1.5 pb-3 mx-auto input-userdata"
      >
        <h3 class="mb-1.5 mt-1">Byta lösenord</h3>
        <div class="flex text-green-600 justify-center">
          <i class="w-64">{{ this.passChanged }}</i>
        </div>
        <table>
          <tr>
            <td align="right" class="py-2.5">
              <div class="pb-3">
                <label for="presentPassword">Nuvarande lösenord:</label>
              </div>
            </td>
            <td align="left">
              <div class="pb-3">
                <input
                  v-model="password"
                  :class="{ 'border-red-400': badPassword }"
                  class="w-24"
                  type="password"
                />
              </div>
            </td>
          </tr>
          <tr>
            <td align="right" class="py-1">
              <label for="password">Nytt lösenord:</label>
            </td>
            <td align="left">
              <input
                v-model="newPassword"
                :class="{
                  'border-red-400': badNewPass,
                }"
                class="w-24"
                type="password"
              />
            </td>
          </tr>

          <tr>
            <td align="right" class="py-2.5">
              <label for="repeatPassword">Upprepa lösenord:</label>
            </td>
            <td align="left">
              <input
                v-model="repeatPassword"
                :class="{ 'border-red-400': badRepeatPass }"
                class="w-24"
                type="password"
              />
            </td>
          </tr>
        </table>

        <div class="flex justify-center">
          <i class="w-64 text-red-700">{{ this.errString }}</i>
        </div>
        <div class="flex justify-center">
          <button @click="changePassword" class="btn-black mt-2" type="submit">
            Byt lösenord
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import friendCalls from "@/services/user_storage/FriendCalls.js"
import storageCalls from "@/services/user_storage/StorageCalls.js"
export default {
  name: "Settings",
  data() {
    return {
      secret: false,
      tipsMail: true,
      firstname: "",
      lastname: "",
      email: "",
      gotData: false,
      password: "",
      newPassword: "",
      repeatPassword: "",
      badPassword: false,
      badNewPass: false,
      badRepeatPass: false,
      errors: [],
      passChanged: "",
    }
  },
  computed: {
    errString: function () {
      let errMessage = this.errors.join(",")

      return errMessage
    },
  },
  methods: {
    Change() {
      if (!this.secret) {
        console.log("Setting secret to true")
        friendCalls.setSecret(true).then(
          (resp) => {
            console.log("Secret set in settings", resp)
            this.secret = true
          },
          (err) => console.log("Error", { err })
        )
      } else {
        friendCalls.setSecret(false).then(
          (resp) => {
            console.log("Secret set to false", resp)
            this.secret = false
          },
          (err) => console.log("Error", { err })
        )
      }
    },
    changeTipsMail() {
      friendCalls.setTipsMail(!this.tipsMail).then(
        (resp) => {
          console.log("tipsMail set in settings", resp)
          this.tipsMail = !this.tipsMail
        },
        (err) => console.log("Error", { err })
      )
    },
    updateUser() {
      storageCalls.updateUser(this.firstname, this.lastname, this.email).then(
        (resp) => console.log(resp),
        (err) => console.log(err)
      )
    },
    changePassword() {
      const { password, newPassword, repeatPassword } = this

      this.errors = []
      this.badPassword = this.badNewPass = this.badRepeatPass = false
      let getOut = false
      let fieldEmpty = false

      if (!password.length) {
        this.badPassword = true
        fieldEmpty = true
        getOut = true
      }

      if (!newPassword.length) {
        this.badNewPass = true
        fieldEmpty = true
        getOut = true
      }
      console.log("First poinmt of interest")
      if (!repeatPassword.length) {
        this.badRepeatPass = true
        fieldEmpty = true
        getOut = true
      }

      if (getOut) {
        this.errors.push("Alla fält är inte ifyllda")
        return
      }

      if (newPassword.trim().length < 7) {
        this.errors.push("Det nya lösenordet måste vara minst 7 tecken långt")
        this.badNewPass = true
        return
      }

      console.log("Now I'm here")
      if (newPassword === repeatPassword) {
        storageCalls.changePassword(password, newPassword).then(
          (resp) => {
            console.log(resp)
            this.passChanged = "Du har bytt lösenord"
            this.password = this.newPassword = this.repeatPassword = ""
          },
          (err) => {
            console.log(err)
            console.log(
              "Error message from changePassword in Settings.vue: ",
              err.response.data.message
            )
            if (err.response.data.message === "badPassword") {
              this.badPassword = true
              this.errors.push("Felaktigt lösenord")
            }
          }
        )
      } else {
        this.badRepeatPass = true
        this.errors.push("Du upprepade inte lösenordet korrekt")
      }
    },
  },
  created: function () {
    friendCalls.getSecret().then(
      (resp) => {
        console.log("Resp inside settings created", resp)
        if (resp.data.hemligt) {
          this.secret = true
        }
      },
      (err) => console.log("ERR", { err })
    ),
      friendCalls.getTipsMail().then(
        (resp) => {
          console.log("Resp inside tipsMail settings", resp)
          console.log("Tips mail prop: ", resp.data[0].tips_mail)
          if (resp.data.length && !resp.data[0].tips_mail) {
            this.tipsMail = false
          } 
        },
        (err) => console.log("ERR", { err })
      ),
      storageCalls.getUserData().then(
        (resp) => {
          console.log("Resp UserData inside settings.vue", resp)
          let user = resp.data[0]

          this.firstname = user.fornamn
          this.lastname = user.efternamn
          this.email = user.email

          this.gotData = true
        },

        (err) => console.log("ERR", { err })
      )
  },
}
</script>
