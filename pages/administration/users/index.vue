<template>
  <admin-users-list />
</template>

<script setup>
import AdminUsersList from '~/components/administration/users/AdminUsersList.vue'
// import { Roles } from '~/constants/roles'

// Define component options (like middleware and meta) in defineOptions for Nuxt 3
// defineOptions({
//   name: 'AdminUsers',
//   middleware: 'authenticated',
//   meta: {
//     authorizedRoles: [Roles.SUPER_ADMIN, Roles.USER_MANAGER]
//   }
// })
</script>