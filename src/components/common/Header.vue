<template>
    <div class="header">
        <div class="logo">
            <span class="title" @click="clickTitle">
                {{$t("message.header.title")}}
            </span>
        </div>
        <div class="user-info">
            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" src="../../../static/img/img.jpg"> {{username}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginout"> {{$t("message.header.logout")}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
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
    </div>
</template>
<script>
export default {
    data() {
        return {
            name: 'admin'
        }
    },
    created() {
        this.init()
    },
    computed: {
        username() {
            let username = localStorage.getItem('ms_username');
            return username ? username : this.name;
        }
    },
    methods: {
        init() {
            if (this.$common.methods.getCookie('isLogin') !== 'true') {
                this.$router.push('/login');
            }
            const lanuage = this.$common.methods.getCookie('lanuage')
            if (lanuage !== 'zh' && lanuage !== 'en') {
                this._i18n.locale = 'zh'
                this.$common.methods.setCookie('lanuage', 'zh')
                return
            }
            this._i18n.locale = lanuage
        },
        handleCommand(command) {
            if (command === 'loginout') {
                this.$common.methods.delCookie('isLogin')
                localStorage.removeItem('ms_username')
                this.$router.push('/login');
            }
        },
        changeLanuage(command) {
            if (command !== 'zh' && command !== 'en') return
            if (this._i18n.locale === command) return
            this.$common.methods.setCookie('lanuage', command)
            history.go(0)
        },
        clickTitle() {
            this.$router.push('/supervisorManager')
        }
    }
}
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    line-height: 70px;
    color: #fff;
}

.header .logo {
    float: left;
    width: 400px;
    padding-left: 20px;
    text-align: left;
}

.user-info {
    float: right;
    padding-right: 50px;
    font-size: 16px;
    color: #fff;
}

.user-info .el-dropdown-link {
    position: relative;
    display: inline-block;
    padding-left: 50px;
    color: #fff;
    cursor: pointer;
    vertical-align: middle;
}

.user-info .user-logo {
    position: absolute;
    left: 0;
    top: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.lanuage {
    float: right;
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

.el-dropdown-menu__item {
    text-align: center;
}

.title:hover {
    cursor: pointer;
    /* text-decoration: underline; */
}
</style>
