# node-red-dashboard-2-ui-treeview
Treeview node-red dashboard 2
based on api https://vuetifyjs.com/en/components/treeview/

![node-red-si](/resources/treeview.gif) 

example payload and ui_update

```
msg.payload = {
  "items": [
    {
      "id": 1,
      "title": "Root",
      "children": [
        {
          "id": 2,
          "title": "Child #1"
        },
        {
          "id": 3,
          "title": "Child #2"
        },
        {
          "id": 4,
          "title": "Child #3",
          "children": [
            {
              "id": 5,
              "title": "Grandchild #1"
            },
            {
              "id": 6,
              "title": "Grandchild #2"
            }
          ]
        }
      ]
    }
  ],
  "selected": [2]
}

msg.ui_update = {
  "openAll": true,
  "strategy": "leaf",
  "selectable": true,
  "indentLines": "default"
}
```



