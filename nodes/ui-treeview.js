

module.exports = function (RED) {
    function UITreeviewNode(config) {
        RED.nodes.createNode(this, config)

        const node = this

        // which group are we rendering this widget
        const group = RED.nodes.getNode(config.group)

        const base = group.getBase()

        // server-side event handlers
        const evts = {
            // onAction: true,
            beforeSend: async function (msg) {
                // check for any dynamic properties being set

                const updates = msg.ui_update
               

                //console.log(msg)
                if (updates) {
                     // save the "example" property in the Node-RED statestore
                    if (typeof updates.indentLines !== 'undefined') {
                       
                        base.stores.state.set(base, node, msg, 'indentLines', updates.indentLines)
                    }

                    if (typeof updates.strategy !== 'undefined') {
                      
                        base.stores.state.set(base, node, msg, 'strategy', updates.strategy)
                    }


                    if (typeof updates.openAll !== 'undefined') {
                   
                        base.stores.state.set(base, node, msg, 'openAll', updates.openAll)
                    }


                    if (typeof updates.selectable !== 'undefined') {
                
                        base.stores.state.set(base, node, msg, 'selectable', updates.selectable)
                    }


                    if (typeof updates.searchEnabled !== 'undefined') {
                     
                        base.stores.state.set(base, node, msg, 'searchEnabled', updates.searchEnabled)
                    }

                    if (typeof updates.itemValue !== 'undefined') {
                     
                        base.stores.state.set(base, node, msg, 'itemValue', updates.itemValue)
                    }

                }



                return msg
            },
            onInput: function (msg, send, done) {
                // store the latest value in our Node-RED datastore
                base.stores.data.save(base, node, msg)

                // send it to any connected nodes in Node-RED
                //send(msg)
            }
        
        }


        if (group) {
            group.register(node, config, evts)
        } else {
            node.error('No group configured')
        }
    }






    RED.nodes.registerType('ui-treeview', UITreeviewNode)
}
