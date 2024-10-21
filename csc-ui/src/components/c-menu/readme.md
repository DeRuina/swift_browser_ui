# c-muna



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description                                                                        | Type                 | Default     |
| --------------- | ---------------- | ---------------------------------------------------------------------------------- | -------------------- | ----------- |
| `customTrigger` | --               | Programmatic trigger component                                                     | `CMenuCustomTrigger` | `undefined` |
| `items`         | --               | Menu items                                                                         | `CMenuOption[]`      | `[]`        |
| `itemsPerPage`  | `items-per-page` | Items per page before adding scroll                                                | `number`             | `6`         |
| `nohover`       | `nohover`        | No hover background                                                                | `boolean`            | `false`     |
| `simple`        | `simple`         | Simple variant without chevron and background, E.g. when a button is the activator | `boolean`            | `false`     |
| `small`         | `small`          | Small variant                                                                      | `boolean`            | `false`     |


## Slots

| Slot | Description                                     |
| ---- | ----------------------------------------------- |
|      | Menu title / activator element (simple variant) |


## Dependencies

### Used by

 - [c-pagination](../c-pagination)

### Depends on

- [c-menu-items](../c-menu-items)

### Graph
```mermaid
graph TD;
  c-menu --> c-menu-items
  c-pagination --> c-menu
  style c-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
