  <script setup lang="ts">
  const props = withDefaults(defineProps<Props>(), {
    columns: [],
    rows: [],
    count: null,
    withSort: false,
    withAction: false,
    withSearch: true,
    rowPerPage: 10,
    buttonData: null,
  })

  const emit = defineEmits(['search'])

  export interface Props {
    columns: any[]
    rows: any[]
    count: number
    withSort: boolean
    withAction: boolean
    withSearch: boolean
    rowPerPage: number
    buttonData: any | null
  }

  const searchQuery = ref('')
  const currentPage = ref(1)
  const rowPerPage = ref(10)
  const totalPage = ref(1)
  const totalRows = ref(0)
  const rows = ref<any[]>(props.rows)
  const count = ref<number>()
  const selectedRows = ref<string[]>([])

  function searchElement() {
    emit('search', {
      searchQuery: searchQuery.value,
      currentPage: currentPage.value,
      rowPerPage: rowPerPage.value,
    })
  }

  // 👉 Fetch Rows
  watchEffect(() => {
    count.value = props.count != null ? props.count : props.rows.length

    totalRows.value = count.value
    totalPage.value = Math.ceil(count.value / rowPerPage.value) ? Math.ceil(count.value / rowPerPage.value) : 1
  })

  watchEffect(() => {
    rows.value = props.rows.filter(row => {
      return props.columns.some(column => {
        return String(row[column.value])
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      })
    })
  })

  // 👉 watching current page
  watchEffect(() => {
    if (currentPage.value > totalPage.value)
      currentPage.value = totalPage.value
  })

  const firstIndex = ref()
  const lastIndex = ref()
  const list = ref<any>([])

  // 👉 Computing pagination data
  const paginationData = computed(() => {
    firstIndex.value = count.value ? (currentPage.value - 1) * rowPerPage.value : 0
    lastIndex.value = rowPerPage.value * currentPage.value

    list.value = rows.value.slice(firstIndex.value, lastIndex.value)

    return `Showing entries`
  })

  const sort_table = ref<any>([])
  const sort_elem_exsist = ref(false)
  function sortColumns(column: any) {
    sort_elem_exsist.value = false
    sort_table.value.map((sort_elem: any) => {
      if (sort_elem.value === column.value) {
        sort_elem.sort = 'desc'
        sort_elem_exsist.value = true
      }
    })
    if (!sort_elem_exsist.value) {
      column.sort = 'asc'
      sort_table.value.push(column)
    }
    emit('search', {
      searchQuery: searchQuery.value,
      currentPage: currentPage.value,
      rowPerPage: rowPerPage.value,
      sort_table: sort_table.value,
    })
  }
  </script>

  <template>
    <VCard
      v-if="list"
      id="invoice-list"
    >
      <VCardText class="d-flex align-center flex-wrap gap-4">
        <!-- 👉 Rows per page -->
        <div
          class="d-flex align-center"
          style="width: 135px;"
        >
          <span class="text-no-wrap me-3">Show:</span>
          <VSelect
            v-model="rowPerPage"
            density="compact"
            :items="[2, 5, 10, 20, 30, 50]"
            @update:model-value="searchElement"
          />
        </div>

        <div class="me-3">
          <slot name="button-data">
            <!-- 👉 Create invoice -->
            <VBtn
              v-if="buttonData"
              :prepend-icon="buttonData.icon"
              :to="{ name: buttonData.route }"
            >
              {{ buttonData.message }}
            </VBtn>
          </slot>
        </div>

        <VSpacer
          v-if="props.withSearch"
        />

        <div
          v-if="props.withSearch"
          class="d-flex align-center flex-wrap gap-4"
        >
          <!-- 👉 Search  -->
          <div class="invoice-list-filter">
            <VTextField
              v-model="searchQuery"
              placeholder="Search"
              density="compact"
              @input="searchElement"
            />
          </div>
        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION Table -->
      <VResponsive>
        <VTable class="text-no-wrap i*nvoice-list-table">
          <!-- 👉 Table head -->
          <thead class="text-uppercase">
            <tr>
              <th
                v-for="(column, index) in props.columns"
                :key="index"
                scope="col"
                class="text-center text-capitalize"
              >
                {{ column?.text }}
                <VIcon
                  v-if="props.withSort"
                  color="#cecece"
                  icon="mdi-swap-vertical"
                  @click="sortColumns(column)"
                />
              </th>
              <th
                v-if="props.withAction"
                scope="col"
                class="text-capitalize"
              >
                Actions
              </th>
            </tr>
          </thead>

          <!-- 👉 Table Body -->
          <tbody>
            <tr
              v-for="row in props.count != null ? props.rows : list"
              :key="row.id"
              style="height: 3.75rem;"
            >
              <td
                v-for="(column, index) in props.columns"
                :key="index"
                scope="col"
                class="text-center"
              >
                <slot
                  :name="column.value"
                  :data="row"
                >
                  {{ row[column.value] }}
                </slot>
              </td>
              <td>
                <slot
                  v-if="props.withAction"
                  name="actions"
                  :data="row"
                >
                  Action
                </slot>
              </td>
            </tr>
          </tbody>

          <!-- 👉 table footer  -->
          <tfoot v-show="!props.rows.length">
            <tr>
              <td
                colspan="8"
                class="text-center text-body-1"
              >
                No data available
              </td>
            </tr>
          </tfoot>
        </VTable>
      </VResponsive>
      <!-- !SECTION -->

      <VDivider />

      <!-- SECTION Pagination -->
      <VCardText class="d-flex align-center flex-wrap gap-4 py-3">
        <!-- 👉 Pagination meta -->
        <span class="text-sm text-disabled">
          {{ paginationData }}
        </span>

        <VSpacer />
        <!-- 👉 Pagination -->
        <VPagination
          v-model="currentPage"
          size="small"
          :total-visible="5"
          :length="totalPage"
          @next="selectedRows = []"
          @prev="selectedRows = []"
          @update:model-value="searchElement"
        />
      </VCardText>
      <!-- !SECTION -->
    </VCard>
  </template>

  <style lang="scss" scoped>
  #invoice-list {
    .invoice-list-actions {
      inline-size: 8rem;
    }

    th,
    td {
      text-align: center;
    }

    .invoice-list-filter {
      inline-size: 12rem;
    }
  }

  ::-webkit-scrollbar {
    block-size: 6px;
    inline-size: 5px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #c5c5c5;
  }
  </style>
