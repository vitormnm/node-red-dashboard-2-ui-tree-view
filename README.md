Treeview node-red dashboard 2
based on api https://vuetifyjs.com/en/components/treeview/

![node-red-si](/resources/treeview.PNG) 


![node-red-si](/resources/treeview.gif) 

example payload and ui_update

```
msg.payload = {
  "items": [
    {
      "id": 1, "title": "Industrial Plant",
      "icon": "mdi-factory", "iconColor": "blue-darken-2",
      "subtitle": "Main production line",
      "badge": "3", "badgeColor": "primary",   // shows child count
      "children": [
        {
          "id": 2, "title": "Sector A — Running",
          "icon": "mdi-engine", "iconColor": "green", "iconSize": "small",
          "statusIcon": "mdi-check-circle", "statusColor": "success",
          "color": "#1D9E75"             // green label text
        },
        {
          "id": 3, "title": "Sector B — Alarm",
          "icon": "mdi-alert", "iconColor": "orange",
          "badge": "!", "badgeColor": "warning",
          "statusIcon": "mdi-alert-circle", "statusColor": "warning",
          "labelClass": "font-weight-bold"  // bold label via CSS class
        },
        {
          "id": 4, "title": "Sector C — Maintenance",
          "icon": "mdi-tools", "iconColor": "grey",
          "disabled": true,              // node is visible but cannot be selected
          "color": "grey",
          "children": [
            {
              "id": 5, "title": "Motor #1",
              "icon": "mdi-cog", "iconSize": "x-small",
              "subtitle": "3500 RPM",        // live value shown as subtitle
              "badge": "OK", "badgeColor": "success"
            },
            {
              "id": 6, "title": "Motor #2",
              "icon": "mdi-cog-off",
              "subtitle": "Stopped",
              "statusIcon": "mdi-close-circle", "statusColor": "error",
              "disabled" : true
            }
          ]
        }
      ]
    }
  ],
  "selected": [2]                // pre-selected item IDs (matched by itemValue field)
}

msg.ui_update = {
  "openAll": true,              // expand the entire tree on load
  "selectable": true,            // show selection checkboxes
  "strategy": "leaf",            // "leaf" | "independent" | "classic"
  "indentLines": "default",      // "default" | false — shows indentation guide lines
  "searchEnabled": true,         // display search field at the top
  "itemValue": "id"              // item field used as the unique selection key
}

return msg
```



