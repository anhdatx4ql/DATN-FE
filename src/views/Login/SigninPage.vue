<template>
    <div class="login">
        <div class="overlay">
            <div class="main">
                <div class="side left-side">
                    <div class="title" style="font-family: Poppins-semibold; font-size: 20px; position: relative; left: 24px;">Asset management system</div>
                    <div class="login-group" style="position: relative; left: 60px; top: 60px;">
                        <div class="login-title" style="font-family: Notosans-semibold; font-size: 30px; position: relative;">Đăng ký</div>
                        <div class="login-title" style="position: relative; top: 20px;">Nếu đã có tài khoản</div>
                        <div class="login-title" style="position: relative; top: 25px;">Bạn có thể <span @click="gotoLogin" style="cursor: pointer; text-decoration: underline;">Đăng nhập</span> tại đây!</div>
                        <div class="input-group">
                            <div class="email-group" style="position: relative; top: 75px;">
                                <div class="title">Username</div>
                                <div class="icon"></div>
                                <input class="input" placeholder="Nhập tên đăng nhập">
                            </div>

                            <div class="pass-group" style="position: relative; top: 95px;">
                                <div class="title">Password</div>
                                <div class="icon"></div>
                                <input ref="passwordCom" class="input" type="password" placeholder="Nhập mật khẩu">
                                <div style="cursor: pointer;" @click="showPass()" class="icon-show"></div>
                            </div>
                            <div class="pass-group" style="position: relative; top: 105px;">
                                <div class="title">Confirm password</div>
                                <div class="icon"></div>
                                <input ref="rePasswordCom" class="input" type="password" placeholder="Nhập lại mật khẩu">
                                <div style="cursor: pointer;" @click="showRePass()" class="icon-show"></div>
                            </div>

                            <button style="position: relative; top: 130px; height: 43px; width: 357px; cursor: pointer;
                                    border: unset; outline: unset; background-color: #0C21C1; color: #fff; border-radius: 32px;">Đăng ký</button>
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
    </div>
</template>
<script>
export default {
    name: "MSLogin",
    methods: {
        showPass(){
            this.isShowPass = !this.isShowPass;
            if (this.isShowPass) {
                this.$refs.passwordCom.type = 'text';
            } else {
                this.$refs.passwordCom.type = 'password';
            }
        },

        showRePass(){
            this.isShowRePass = !this.isShowRePass;
            if (this.isShowRePass) {
                this.$refs.rePasswordCom.type = 'text';
            } else {
                this.$refs.rePasswordCom.type = 'password';
            }
        },

        gotoLogin(){
            this.$router.push('/login');
        }
    },
    data() {
        return {
            isShowPass: false,
            isShowRePass: false,
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
        background-image: linear-gradient(#ddd6f3, #faaca8);
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