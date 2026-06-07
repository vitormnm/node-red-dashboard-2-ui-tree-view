<template>
    <div class="treeview-scroll-container">

        <v-text-field v-model="search" v-if="searchEnabled" placeholder="Search" prepend-inner-icon="mdi-magnify"
            variant="outlined" hide-details density="comfortable" class="search-box" />

        <v-treeview v-model:selected="selected" :indent-lines="indentLines" :items="items" :select-strategy="strategy"
            :item-value="itemValue" :selectable="selectable" :open-all="openAll" :search="search"
            :item-disabled="'disabled'">

            <template #prepend="slotProps">
                <v-icon
                    v-if="getIcon(slotProps)"
                    :color="getColor(slotProps)"
                    :size="getIconSize(slotProps)">
                    {{ getIcon(slotProps) }}
                </v-icon>
            </template>

            <template #label="slotProps">
                <span
                    :style="getLabelStyle(slotProps)"
                    :class="getLabelClass(slotProps)">
                    {{ getRaw(slotProps, 'title') }}
                </span>
                <div v-if="getRaw(slotProps, 'subtitle')" class="treeview-subtitle">
                    {{ getRaw(slotProps, 'subtitle') }}
                </div>
            </template>

            <template #append="slotProps">
                <v-chip
                    v-if="getRaw(slotProps, 'badge') !== undefined && getRaw(slotProps, 'badge') !== null"
                    size="x-small"
                    :color="getRaw(slotProps, 'badgeColor') || 'primary'"
                    class="treeview-badge">
                    {{ getRaw(slotProps, 'badge') }}
                </v-chip>
                <v-icon
                    v-if="getRaw(slotProps, 'statusIcon')"
                    :color="getRaw(slotProps, 'statusColor') || 'grey'"
                    size="16"
                    class="treeview-status-icon">
                    {{ getRaw(slotProps, 'statusIcon') }}
                </v-icon>
            </template>

        </v-treeview>

    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'UIExample',
    inject: ['$socket', '$dataTracker'],
    props: {
        id: { type: String, required: true },
        props: { type: Object, default: () => ({}) },
        state: { type: Object, default: () => ({ enabled: false, visible: false }) }
    },
    setup (props) {},
    data () {
        return {
            msg: null,
            openAll: false,
            indentLines: null,
            strategy: false,
            selectable: true,
            search: null,
            searchEnabled: true,
            selected: [],
            items: []
        }
    },

    watch: {
        selected: function (newVal) {
            if (!Array.isArray(newVal)) return
            if (!Array.isArray(this.items) || this.items.length === 0) return

            // Workaround bug Vuetify 3: item-disabled nao bloqueia selecao
            const disabledIds = this.getDisabledIds(this.items)
            const filtered = newVal.filter(id => !disabledIds.includes(id))

            // Se clicou em item disabled, reverte silenciosamente sem enviar
            if (filtered.length !== newVal.length) {
                this.$nextTick(() => { this.selected = filtered })
                return
            }

            const itemVal = this.getProperty('itemValue')
            const objSelected = this.findByIds(this.items, filtered, itemVal)

            this.send({
                payload: {
                    items: this.items,
                    selected: filtered,
                    objSelected: objSelected
                }
            })
        }
    },

    mounted () {
        this.$socket.on('widget-load:' + this.id, (msg) => {
            this.$store.commit('data/bind', { widgetId: this.id, msg })
        })
        this.$socket.on('msg-input:' + this.id, (msg) => {
            this.$store.commit('data/bind', { widgetId: this.id, msg })
        })
    },

    computed: {
        ...mapState('data', ['messages']),

        indentLines () {
            if (this.getProperty('indentLines') === 'false') return false
            return this.getProperty('indentLines')
        },
        strategy () { return this.getProperty('strategy') },
        openAll () { return JSON.parse(this.getProperty('openAll')) },
        selectable () { return JSON.parse(this.getProperty('selectable')) },
        searchEnabled () { return JSON.parse(this.getProperty('searchEnabled')) },
        itemValue () { return this.getProperty('itemValue') }
    },

    created () {
        this.$dataTracker(this.id, this.onInput, this.onLoad, this.onDynamicProperties)
    },

    methods: {
        send (msg) {
            this.$socket.emit('widget-change', this.id, msg)
        },

        // Extrai o objeto raw do slot, compativel com Vuetify 3
        getRaw (slotProps, key) {
            if (!slotProps) return null
            const raw = slotProps.item?.raw ?? slotProps.item ?? {}
            return key ? raw[key] : raw
        },

        getIcon (slotProps) {
            const raw = this.getRaw(slotProps)
            if (!raw) return null
            return raw.icon || null
        },

        getColor (slotProps) {
            const raw = this.getRaw(slotProps)
            if (!raw) return undefined
            return raw.iconColor || raw.color || undefined
        },

        getIconSize (slotProps) {
            const raw = this.getRaw(slotProps)
            if (!raw) return 'default'
            return raw.iconSize || 'default'
        },

        getLabelStyle (slotProps) {
            const raw = this.getRaw(slotProps)
            if (!raw || !raw.color) return {}
            return { color: raw.color }
        },

        getLabelClass (slotProps) {
            const raw = this.getRaw(slotProps)
            if (!raw) return ''
            return raw.labelClass || ''
        },

        // Retorna todos os IDs de itens com disabled: true (recursivo)
        getDisabledIds (tree) {
            const result = []
            if (!Array.isArray(tree)) return result
            const itemVal = this.getProperty('itemValue') || 'id'
            function walk (node) {
                if (!node) return
                if (node.disabled === true) result.push(node[itemVal])
                if (Array.isArray(node.children)) node.children.forEach(child => walk(child))
            }
            tree.forEach(root => walk(root))
            return result
        },

        onInput (msg) {
            if (!msg || !msg.payload) return
            const payload = msg.payload
            if (payload.items !== undefined) this.items = payload.items
            if (payload.selected !== undefined) this.selected = payload.selected
        },

        onLoad (msg, state) {
            if (!msg || !msg.payload) return
            this.selected = msg.payload.selected || []
            this.items = msg.payload.items || []
        },

        onDynamicProperties (msg) {
            const updates = msg.ui_update
            if (!updates) return
            if (typeof updates.indentLines !== 'undefined') this.updateDynamicProperty('indentLines', updates.indentLines)
            if (typeof updates.strategy !== 'undefined') this.updateDynamicProperty('strategy', updates.strategy)
            if (typeof updates.openAll !== 'undefined') this.updateDynamicProperty('openAll', updates.openAll)
            if (typeof updates.selectable !== 'undefined') this.updateDynamicProperty('selectable', updates.selectable)
            if (typeof updates.searchEnabled !== 'undefined') this.updateDynamicProperty('searchEnabled', updates.searchEnabled)
            if (typeof updates.itemValue !== 'undefined') this.updateDynamicProperty('itemValue', updates.itemValue)
        },

        findByIds (tree, ids, itemValue) {
            const result = []
            if (!Array.isArray(tree) || !Array.isArray(ids) || !itemValue) return result
            function search (node) {
                if (!node) return
                if (ids.includes(node[itemValue])) result.push(node)
                if (Array.isArray(node.children)) node.children.forEach(child => search(child))
            }
            tree.forEach(root => search(root))
            return result
        }
    }
}
</script>

<style scoped>
@import "../stylesheets/ui-treeview.css";

.treeview-scroll-container {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
}

.treeview-scroll-container :deep(.v-list-item-title) {
    text-overflow: unset !important;
    overflow: visible !important;
    white-space: nowrap !important;
}

.treeview-scroll-container :deep(.v-list-item) {
    width: max-content;
    min-width: 100%;
}

.treeview-subtitle {
    font-size: 11px;
    opacity: 0.6;
    line-height: 1.3;
    white-space: normal;
}

.treeview-badge {
    margin-left: 6px;
}

.treeview-status-icon {
    margin-left: 4px;
}
</style>