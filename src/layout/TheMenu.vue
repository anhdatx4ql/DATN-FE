// Component hiển thị phần menu dùng chung của website
// Author: Xuân Đào (05/03/2023)
<template>
    <div class="menu">
        <!-- Phần hiển thị chính của menu bar -->
        <div class="menu-area">
            <!-- Phần hiển thị logo -->
            <div class="menu-logo">
                <div title="Menu option" class="menu-logo__option">
                    <div class="toggle-icon"></div>
                </div>
                <div class="menu-logo__component" style="display: flex; color: #fff; column-gap: 8px;">
                    <div style="width: 30px; overflow: hidden;" class="logo-icon">
                        <img src="@/assets/img/Logo.png" alt="">
                    </div>
                    <span style="font-family: Opens-san-bold; line-height: 34px;">Tài sản</span>
                </div>
            </div>
            <!-- Phần hiển thị danh sách các option trong menu chính -->
            <router-link to="/" class="menu-item">
                <!-- Phần hiển thị icon -->
                <div class="menu-item__icon">
                    <div class="icon dashboard"></div>
                </div>
                <!-- Phần hiển thị text -->
                <div class="menu-item__context">{{ data[0] }}</div>
            </router-link>
            <router-link to="/Asset" class="menu-item">
                <div class="menu-item__icon">
                    <div class="icon asset"></div>
                </div>
                <div class="menu-item__context">{{ data[7] }}</div>
            </router-link>
            <router-link to="/CA" class="menu-item">
                <div class="menu-item__icon">
                    <div class="icon order"></div>
                </div>
                <div class="menu-item__context">{{ 'Quản lý hóa đơn' }}</div>
            </router-link>
            <!-- <router-link to="/CA" class="menu-item">
                <div class="menu-item__icon">
                    <div class="icon money"></div>
                </div>
                <div class="menu-item__context">{{ data[1] }}</div>
            </router-link> -->
            <router-link to="/Deploy" class="menu-item">
                <div class="menu-item__icon">
                    <div class="icon s-money"></div>
                </div>
                <div class="menu-item__context">{{ 'Cấp phát' }}</div>
            </router-link>
            <router-link to="/DI/DIEmployee" class="menu-item">
                <div class="menu-item__icon">
                    <div class="icon employee-icon-2"></div>
                </div>
                <div class="menu-item__context">{{ 'Nhân viên' }}</div>
            </router-link>
            <router-link to="/Supplier" class="menu-item">
                <div class="menu-item__icon">
                    <div class="icon sell"></div>
                </div>
                <div class="menu-item__context">{{ 'Nhà cung cấp' }}</div>
            </router-link>
            <div class="menu-item">
                <div class="menu-item__icon">
                    <div class="icon buy"></div>
                </div>
                <div class="menu-item__context">{{ data[3] }}</div>
            </div>
            <div class="menu-item">
                <div class="menu-item__icon">
                    <div class="icon tools"></div>
                </div>
                <div class="menu-item__context" :title="data[6]">{{ data[6] }}</div>
            </div>
            <div class="menu-item">
                <div class="menu-item__icon">
                    <div class="icon report"></div>
                </div>
                <div class="menu-item__context" id="report">{{ data[8] }}</div>
            </div>
            <div class="menu-item">
                <div class="menu-item__icon">
                    <div class="icon price"></div>
                </div>
                <div class="menu-item__context">{{ data[9] }}</div>
            </div>
            <div class="menu-item">
                <div class="menu-item__icon">
                    <div class="icon synthetic"></div>
                </div>
                <div class="menu-item__context">{{ data[11] }}</div>
            </div>
            <div class="menu-item">
                <div class="menu-item__icon">
                    <div class="icon budget"></div>
                </div>
                <div class="menu-item__context">{{ data[12] }}</div>
            </div>
            <router-link to="/DI" class="menu-item">
                <div class="menu-item__icon">
                    <div class="icon user-group"></div>
                </div>
                <div class="menu-item__context">{{ data[13] }}</div>
            </router-link>
        </div>
    </div>
</template>
<script>
import resources from '../js/resources.js'
export default {

    name: "TheMenu",

    components: {

    },
    data(){
        return {
            data: resources.vi.menuItem
        }
    }
}
</script>
<style>
    .menu {
        height: 100vh;
        width: 178px;
        background-color: #041434;
        float: left;
        box-sizing: border-box;
    }

    .toggle-icon{
        background-image: url("/src/assets/icons/toggle.png");
        background-size: 20px 20px;
        height: 20px;
        width: 20px;
        margin-left: 24px;
    }
    .logo-icon{
        /* background-image: url("/src/assets/img/Logo_Module_TiengViet_White.66947422.png");
        background-size: 94px 32px; */
        height: 32px;
        width: 94px;
    }

    .toggle-icon:hover, .logo-icon:hover{
        cursor: pointer;
    }
</style>