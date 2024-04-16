<template>
  <v-row>
    <v-col cols="12" md="6" lg="4">
      <v-table>
        <tbody>
          <tr
            v-for="(item, i) in items"
            :key="i"
          >
            <td class="text-medium-emphasis">
              <v-icon start>{{ item.icon }}</v-icon>
              {{ item.title }}
            </td>
            <td>{{ item.value }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
type Item = { title: string, icon: string, value: string };

defineProps<{ items: Item[] }>();
</script>
