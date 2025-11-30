<template>


    <div class="treeview-scroll-container">


        <v-text-field v-model="search" v-if="searchEnabled" placeholder="Search" prepend-inner-icon="mdi-magnify"
            variant="outlined" hide-details density="comfortable" class="search-box"  />

        <v-treeview v-model:selected="selected" :indent-lines="indentLines" :items="items" :select-strategy="strategy"
            :item-value="itemValue" :selectable="selectable" :open-all="openAll" :search="search" />
    </div>
</template>

<script>
//return-object
import { mapState } from 'vuex'


export default {
    name: 'UIExample',
    inject: ['$socket', '$dataTracker'],
    props: {
        /* do not remove entries from this - Dashboard's Layout Manager's will pass this data to your component */
        id: { type: String, required: true },
        props: { type: Object, default: () => ({}) },
        state: { type: Object, default: () => ({ enabled: false, visible: false }) }
    },
    setup(props) {

    },
    data() {
        return {
            msg: null,
            input: {
                title: 'some text here will base turned into title case.'
            },
            openAll: false,
            indentLines: null, //simple , none , default
            strategy: false, //['leaf', 'single-leaf', 'independent', 'single-independent', 'classic']
            selectable: true,
            search: null,
            searchEnabled: true,
            selected: [],
            items: [],
            vuetifyStyles: [
                { label: 'Responsive Displays', url: 'https://vuetifyjs.com/en/styles/display/#display' },
                { label: 'Flex', url: 'https://vuetifyjs.com/en/styles/flex/' },
                { label: 'Spacing', url: 'https://vuetifyjs.com/en/styles/spacing/#how-it-works' },
                { label: 'Text & Typography', url: 'https://vuetifyjs.com/en/styles/text-and-typography/#typography' }
            ]
        }
    },

    watch: {
        // watch for any changes of "count"
        selected: function () {

            if (this.selected != undefined) {

                
                if (this.selected.length > 0) {

                    var payload = this.findByIds(this.items, this.selected , this.getProperty('itemValue'))
                    this.send({ payload: payload })
                }
            }

        }





    },

    mounted() {
        // code here when the component is first loaded
        this.$socket.on('widget-load:' + this.id, (msg) => {


            // load the latest message from the Node-RED datastore when this widget is loaded
            // storing it in our vuex store so that we have it saved as we navigate around
            this.$store.commit('data/bind', {
                widgetId: this.id,
                msg
            })


        })

        this.$socket.on('msg-input:' + this.id, (msg) => {

            // store the latest message in our client-side vuex store when we receive a new message
            this.$store.commit('data/bind', {
                widgetId: this.id,
                msg
            })
        })

        



    },

    computed: {

        ...mapState('data', ['messages']),


        indentLines() {

            if (this.getProperty('indentLines') === 'false') {
                return false
            }

            return this.getProperty('indentLines')
        },

        strategy() {
            return this.getProperty('strategy')
        },


        openAll() {
            return JSON.parse(this.getProperty('openAll'));
        },

        selectable() {
            return JSON.parse(this.getProperty('selectable'));
        },
        searchEnabled() {
            return JSON.parse(this.getProperty('searchEnabled'));
        },


        itemValue() {

            return this.getProperty('itemValue')
        }




    },
    created() {
        // setup our event handlers, and informs Node-RED that this widget has loaded
        this.$dataTracker(this.id, this.onInput, this.onLoad, this.onDynamicProperties)





    },
    methods: {
        /*
            widget-action just sends a msg to Node-RED, it does not store the msg state server-side
            alternatively, you can use widget-change, which will also store the msg in the Node's datastore
        */
        send(msg) {

            this.$socket.emit('widget-change', this.id, msg)
        },
        /*
            (optional) UIExample setup with:  onInput function to handle incoming messages from Node-RED
        */
        onInput(msg) {
            // load the latest message from the Node-RED datastore when this widget is loaded
            // storing it in our vuex store so that we have it saved as we navigate around


            const payload = msg.payload

            if (payload.items != undefined) {

                this.items = payload?.items
            }

            if (payload.selected != undefined) {

                this.selected = payload?.selected
            }

            this.$store.commit('data/bind', {
                widgetId: this.id,
                msg
            })
        },
        /*
            (optional) Custom onLoad function to handle the loading state of the widget
            msg   - the latest message from the Node-RED datastore
            state - The Node-RED config, including any overrides saved to the server-side statestore
        */
        onLoad(msg, state) {
            // loads the last msg received into this node from the Node-RED datastore
            // state is auto-stored into the widget props, but is available here if you want to do anything else


            this.selected = msg?.payload.selected
            this.items = msg?.payload.items

        },
        /*
            (optional) Custom onDynamicProperties function to handle dynamic properties
            msg - the latest message from the Node-RED datastore
        */


        onDynamicProperties(msg) {

            const updates = msg.ui_update


            if (!updates) {
                return
            }



            if (typeof updates.indentLines !== 'undefined') {
                // save the "example" property in the Node-RED statestore
                this.updateDynamicProperty('indentLines', updates.indentLines)
            }

            if (typeof updates.strategy !== 'undefined') {
                // save the "example" property in the Node-RED statestore
                this.updateDynamicProperty('strategy', updates.strategy)
            }

            if (typeof updates.openAll !== 'undefined') {
                // save the "example" property in the Node-RED statestore
                this.updateDynamicProperty('openAll', updates.openAll)
            }

            if (typeof updates.selectable !== 'undefined') {
                // save the "example" property in the Node-RED statestore
                this.updateDynamicProperty('selectable', updates.selectable)
            }

            if (typeof updates.searchEnabled !== 'undefined') {
                // save the "example" property in the Node-RED statestore
                this.updateDynamicProperty('searchEnabled', updates.searchEnabled)
            }

            if (typeof updates.itemValue !== 'undefined') {
                // save the "example" property in the Node-RED statestore
                this.updateDynamicProperty('searchEnabled', updates.itemValue)
            }



        },




        setselected(selected) {
            if (selected != undefined && selected != null) {
                this.selected = selected
            }
        },

        findByIds(tree, ids , itemValue) {
            const result = [];

            function search(node) {
                if (ids.includes(node[itemValue])) {
                    result.push(node);
                }
                if (node.children) {
                    node.children.forEach(child => search(child));
                }
            }

            tree.forEach(root => search(root));
            return result;
        },
   
    }
}
</script>

<style scoped>
/* CSS is auto scoped, but using named classes is still recommended */
@import "../stylesheets/ui-treeview.css";

/* 1. Configuração do Container para permitir Scroll */
.treeview-scroll-container {
    width: 100%;
    /* Ocupa a largura disponível */
    overflow-x: auto;
    /* Habilita o scroll lateral se necessário */
    white-space: nowrap;
    /* Impede que o conteúdo quebre linha */
}

/* 2. Sobrescrevendo o estilo do Vuetify que cria os "..." */
/* O :deep() é necessário se estiver usando scoped styles */
.treeview-scroll-container :deep(.v-list-item-title) {
    text-overflow: unset !important;
    /* Remove o "..." */
    overflow: visible !important;
    /* Permite que o texto exceda o container */
    white-space: nowrap !important;
    /* Mantém em uma linha */
}

/* Opcional: Ajuste a largura do item para não ficar preso a 100% do pai */
.treeview-scroll-container :deep(.v-list-item) {
    width: max-content;
    /* O item cresce o quanto o texto precisar */
    min-width: 100%;
    /* Mas nunca fica menor que a tela */
}
</style>
