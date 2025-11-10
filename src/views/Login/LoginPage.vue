<template>
    <div class="login">
        <div class="overlay">
            <div class="main">
                <div class="side left-side">
                    <div class="title" style="font-family: Poppins-semibold; font-size: 20px; position: relative; left: 24px;">Asset management system</div>
                    <div class="login-group" style="position: relative; left: 60px; top: 60px;">
                        <div class="login-title" @click="showLoader = true" style="font-family: Notosans-semibold; font-size: 30px; position: relative;">Đăng nhập</div>
                        <div class="login-title" style="position: relative; top: 20px;">Nếu chưa có tài khoản</div>
                        <div class="login-title" style="position: relative; top: 25px;">Bạn có thể <span @click="gotoSignin" style="cursor: pointer; text-decoration: underline;">Đăng ký</span> tại đây!</div>
                        <div class="input-group">
                            <div class="email-group" style="position: relative; top: 75px;">
                                <div class="title">Username</div>
                                <div class="icon"></div>
                                <input ref="username" class="input" placeholder="Nhập tên đăng nhập">
                            </div>

                            <div class="pass-group" style="position: relative; top: 115px;">
                                <div class="title">Password</div>
                                <div class="icon"></div>
                                <input ref="passwordCom" class="input" type="password" placeholder="Nhập mật khẩu">
                                <div style="cursor: pointer;" @click="showPass()" class="icon-show"></div>
                            </div>
                            <div class="remember-pass" style="display: flex; column-gap: 8px; position: relative; top: 130px;">
                                <input type="checkbox" v-model="rememberPassword" style="cursor: pointer;">
                                <div style="font-size: 12px; line-height: 12px;">Nhớ mật khẩu</div>
                                <div class="forget-pass" style="position: relative; left: 160px; font-size: 12px; line-height: 12px; cursor: pointer;">Quên mật khẩu</div>
                            </div>
                            <button @click="login" style="position: relative; top: 170px; height: 43px; width: 357px; cursor: pointer;
                                    border: unset; outline: unset; background-color: #0C21C1; color: #fff; border-radius: 32px;">Đăng nhập</button>
                        </div>
                    </div>
                </div>
                <div class="side right-side">
                    <div class="phone-number" style="display: flex; position: absolute; top: 18px; right: 18px; column-gap: 10px; align-items: center;">
                        <div class="icon" style="height: 28px; width: 28px;">
                            <img src="@/assets/icons/contact.png">
                        </div>
                        <div style="font-family: Poppins-semibold; font-size: 18px; color: #fff;">0379 459 937</div>
                    </div>
                    <div class="image" style="height: 400px; width: 400px; margin: 20px auto;"></div>
                    <div class="text" style="position: relative; left: 48px; top: 24px;">
                        <div class="title" style="font-size: 32px; font-family: Notosans-semibold; color: #fff;">Đăng ký tài khoản</div>
                        <div class="description" style="color: #fff; position: relative; top: 8px;">Hệ thống quản lý tài sản</div>
                    </div>
                </div>
            </div>
        </div>
      <CircleLoader v-if="showLoader"></CircleLoader>
      <MSingleActionDialog ref="singleDialog"></MSingleActionDialog>
    </div>
</template>
<script>
import CircleLoader from '@/components/CircleLoader.vue';
import MSingleActionDialog, { dialogType } from '@/components/unit-components/MSingleActionDialog.vue';
import App from '@/App.vue';
import resources from '@/js/resources';
export default {
    name: "MSLogin",
    extends: App,
    components: {CircleLoader, MSingleActionDialog},
    methods: {
        showPass(){
            this.isShowPass = !this.isShowPass;
            if (this.isShowPass) {
                this.$refs.passwordCom.type = 'text';
            } else {
                this.$refs.passwordCom.type = 'password';
            }
        },

        gotoSignin(){
            this.$router.push('/signin');
        },

        validate(){
            let username = this.$refs.username.value;
            let password = this.$refs.passwordCom.value;
            if (username.length == 0) {
                this.$refs.singleDialog.showDialogOn(dialogType.warning, 'Username không được để trống !', 'Đồng ý');
                this.$refs.Alert.centerDialogVisible = true;
                return false;
            } else if (password.length == 0) {
                this.$refs.singleDialog.showDialogOn(dialogType.warning, 'Password không được để trống !', 'Đồng ý');
                this.$refs.Alert.centerDialogVisible = true;
                return false;
            }
            return true;
        },

        async login(){
            let me = this;
            if (me.validate()){
                this.showLoader = true;
                let username = this.$refs.username.value;
                let password = this.$refs.passwordCom.value;
                let endpoint = `${this.res.endpoint}LoginAccount`
                /*eslint-disable no-debugger */
                debugger
                try{
                    let res = await fetch(endpoint);
                    if (res.status == 200) {
                        let data = await res.json();
                        if (data.length > 0) {
                            let exacUsername = data.filter(x => x.username == username).length > 0;
                            let exacPassword = data.filter(x => x.password == password).length > 0;
                            if (exacUsername && exacPassword) {
                                if (!this.rememberPassword){
                                    sessionStorage.token = data.filter(x => x.username == username)[0].username;
                                    sessionStorage.account = JSON.stringify(data.filter(x => x.username == username)[0]);
                                } else {
                                    localStorage.token = data.filter(x => x.username == username)[0].username;
                                    localStorage.account = JSON.stringify(data.filter(x => x.username == username)[0]);
                                }
                                this.$router.push('/');
                            } else if (exacUsername) {
                                this.$refs.singleDialog.showDialogOn(dialogType.warning, 'Mật khẩu không đúng!', 'Đồng ý');
                            } else {
                                this.$refs.singleDialog.showDialogOn(dialogType.warning, 'Tài khoản hoặc mật khẩu không đúng!', 'Đồng ý');
                            }
                        }
                    }
                    else {
                        this.$refs.singleDialog.showDialogOn(dialogType.warning, 'Đăng nhập thất bại vui lòng liên hệ hỗ trợ!', 'Đồng ý');
                        this.$refs.Alert.centerDialogVisible = true;
                    }
                    this.showLoader = false;
                }
                catch {
                    this.alertMessage = 'Đăng nhập thất bại vui lòng liên hệ hỗ trợ!'
                    this.showLoader = false;
                }
            }
        }
    },
    data() {
        return {
            isShowPass: false,
            alertMessage: '',
            rememberPassword: false,
            showLoader: false,
            res: resources
        }
    },
}
</script>
<style scoped>
    .login{
        height: 100vh;
        width: 100vw;
        position: fixed;
        background-color: #fff;
        top: 0;
        left: 0;
        font-family: Notosans;
    }
    .overlay{
        height: 100%;
        width: 100%;
        background-image: linear-gradient(#6c44eb, #bf7571);
    }
    .main{
        height: 675px;
        width: 1080px;
        display: flex;
        column-gap: 1%;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        position: fixed;
        top: calc((100vh - 675px)/2);
        left: calc((100vw - 1080px)/2);
    }

    .main .side{
        height: 625px;
        width: 48%;
    }

    .main .right-side{
        background-color: #000842e5;
        border-radius: 15px;
        position: relative;
    }

    .main .right-side .image{
        background-image: url("@/assets/img/login.png");
        background-size: contain;
    }

    .input-group .title{
        font-family: Poppins;
        font-size: 13px;
        color: #999999;
    }

    .input-group .input{
        height: 38px;
        width: 330px;
        padding-left: 27px;
        border: unset;
        outline: unset;
        font-size: 16px;
        color: #000842;
        border-bottom: solid #000842 2px;
    }

    .input-group input::placeholder {
        color: #000842;
        font-size: 16px;
    }

    .email-group .icon{
        background-image: url("@/assets/icons/email.png");
        height: 17px;
        width: 17.5px;
        background-size: contain;
        position: relative;
        top: 27px;
    }

    .pass-group .icon{
        background-image: url("@/assets/icons/pass.png");
        height: 17px;
        width: 17.5px;
        background-size: contain;
        position: relative;
        top: 27px;
    }

    .pass-group .icon-show{
        background-image: url("@/assets/icons/show-pass.png");
        height: 17px;
        width: 17.5px;
        background-size: contain;
        position: relative;
        top: -27px;
        left: 340px;
    }

    .input-group button:hover{
        background-color: #0c21c1e0 !important;
    }
</style>