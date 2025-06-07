<template>
  <div class="p-4">
    <!-- No access message -->
    <Card v-if="!hasAccess()" class="bg-gray-100 text-black mb-8">
      <template #title>
        <h3 class="text-3xl font-bold">Welcome to BO Data</h3>
      </template>
      <template #content>
        <p class="text-lg">
          You currently do not have any assigned roles and therefore cannot
          access any part of this application.
        </p>
        <hr class="my-4" />
        <p class="text-md">
          For full access to the back-office features, please contact an admin
          (team Meson / Segmentation & AB Test).
        </p>
      </template>
    </Card>

    <!-- Menu Items -->
    <div
      v-for="item in menuItems"
      :key="item.title"
      v-if="hasAccess(item?.roles)"
      class="mb-8"
    >
      <h2 class="text-2xl font-semibold mb-4">{{ item?.title }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
          v-for="subItem in item.items"
          :key="subItem.title"
          v-if="hasAccess(subItem?.roles)"
          :to="subItem.to"
          class="block"
        >
          <Card
            class="bg-black! text-white text-center hover:bg-gray-800! transition"
          >
            <template #content>
              <div class="flex flex-col items-center p-4 text-xl text-white">
                <i :class="subItem.icon" class="text-4xl! mb-2"></i>
                <h3 class="text-lg! font-medium">{{ subItem.title }}</h3>
              </div>
            </template>
          </Card>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import intersection from 'lodash/intersection';
import menu from '@/constants/menu.json';
import { Roles } from '@/constants/roles';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const menuItems = menu;

const hasAccess = (authorizedRoles: string[] | null = null): boolean => {
  return true 
  const user = auth.infos;
  if (!user) return false

  const userRoles = user?.roles || [];

  return (
    userRoles.includes(Roles.SUPER_ADMIN) || authorizedRoles == null
    // || intersection(userRoles, authorizedRoles).length > 0
  );
};
</script>

<style scoped>
/* You can add Tailwind utility classes instead of scoped CSS */
</style>
