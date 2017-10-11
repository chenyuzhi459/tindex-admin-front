<template>
    <div class="login-wrap">
        <div class="lanuage">
            <el-dropdown @command="changeLanuage">
                <span class="el-dropdown-link">
                    {{$t("message.header.changeLanuage")}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="zh"> 中文</el-dropdown-item>
                    <el-dropdown-item command="en">English</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="ms-title">{{$t("message.header.title")}}</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" :placeholder="$t('message.login.username')"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" :placeholder="$t('message.login.password')" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">{{$t("message.login.buttonContent")}}</el-button>
                </div>
                <template v-if="hasError">
                    <span style="color: red">{{$t("message.login.errorTips")}}</span>
                </template>
                <p style="font-size:12px;line-height:30px;color:#999;"></p>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ruleForm: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: this.$t('message.login.ruleMessage1'), trigger: 'blur' }
                ],
                password: [
                    { required: true, message: this.$t('message.login.ruleMessage2'), trigger: 'blur' }
                ]
            },
            hasError: false
        }
    },
    beforeCreate() {
        //data中有用到国际化的东西,那么locale的初始化必须放在beforeCrete中,不可放在created中,因为data的初始化是在created生命周期前进行的
        const lanuage = this.$common.methods.getCookie('lanuage')
        if (lanuage !== 'zh' && lanuage !== 'en') {
            this._i18n.locale = 'zh'
            this.$common.methods.setCookie('lanuage', 'zh')
            return
        }
        this._i18n.locale = lanuage
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.login(this.ruleForm)
                } else {
                    return false;
                }
            });
        },
        async login(formObject) {
            try {
                const response = await this.$http.post(this.$common.apis.login, formObject, {
                    header: { ContentType: "application/json" }
                })
                localStorage.setItem('ms_username', formObject.username);
                this.$router.push('/index');
            } catch (err) {
                this.hasError = true
            }
        },
        changeLanuage(command) {
            if (command !== 'zh' && command !== 'en') return
            if (this._i18n.locale === command) return
            this.$common.methods.setCookie('lanuage', command)
            history.go(0)
        }
    }
}
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
}

.lanuage {
    float: right;
    margin-top: 10px;
    padding-right: 25px;
    font-size: 16px;
    color: #fff;
}

.lanuage .el-dropdown-link {
    position: relative;
    display: inline-block;
    padding-left: 50px;
    color: #fff;
    cursor: pointer;
    vertical-align: middle;
}


.ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;
}

.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 160px;
    margin: -150px 0 0 -190px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 36px;
}
</style>