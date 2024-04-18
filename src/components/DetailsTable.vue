<template>
  <v-table>
    <tbody>
      <tr
        v-for="(item, i) in items"
        :key="i"
      >
        <td class="text-medium-emphasis">
          <span class="d-flex">
            <v-icon start>{{ item.icon }}</v-icon>
            {{ item.title }}
          </span>
        </td>
        <td>{{ item.value }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
type Item = { title: string, icon: string, value: string };

defineProps<{ items: Item[] }>();
</script>
