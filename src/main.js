module.exports = (vemto) => {
  return {
    canInstall () {
      return true
    },

    onInstall () {
    },

    beforeCodeGenerationEnd () {
      let models = vemto.getProjectModels()
      let projectCruds = vemto.getProject().getMainCruds()
      let options = { formatAs: 'ts', data: {} }

      vemto.log.warning(`Generate React Starter Kit`)
      /**
       * Generate entities.
       */
      models.forEach(model => {
        options.data = {
          model
        }

        vemto.renderTemplate('files/TypeScriptEntity.vemtl', `resources/js/types/${model.name.case('pascalCase')}.entity.ts`, options)
      })

      /**
       * Generate crud
       */
      projectCruds.forEach(crud => {
        const data = {
          model: {
            name: crud.model.name.case('pascalCase'),
            url: crud.url,
            controllerName: crud.model.getControllerName(),
            routes: crud.model.plural.case('paramCase'),
            modelName: crud.model.name.case('camelCase'),
            fields: crud.inputs
          }
        }

        let crudPath = `/${crud.url}`
        let controllerPath = `app/Http/Controllers/${crud.model.plural.case('pascalCase')}`
        let routePath = `routes`
        options.data = data

        vemto.renderTemplate('files/pages/Form.vemtl', `resources/js/pages/${crudPath}/form/${crud.model.name.case('pascalCase')}Form.tsx`, options)
        vemto.renderTemplate('files/pages/Table.vemtl', `resources/js/pages/${crudPath}/table/${crud.model.name.case('pascalCase')}Table.tsx`, options)
        vemto.renderTemplate('files/pages/Show.vemtl', `resources/js/pages/${crudPath}/show.tsx`, options)
        vemto.renderTemplate('files/pages/Index.vemtl', `resources/js/pages/${crudPath}/index.tsx`, options)
        vemto.renderTemplate('files/pages/Edit.vemtl', `resources/js/pages/${crudPath}/edit.tsx`, options)
        vemto.renderTemplate('files/pages/Create.vemtl', `resources/js/pages/${crudPath}/create.tsx`, options)
        vemto.renderTemplate('files/pages/Controller.vemtl', `${controllerPath}/${crud.model.getControllerName()}.php`, options)
        vemto.renderTemplate('files/pages/Route.vemtl', `${routePath}/${crud.url}.php`, options)
      })
    },
  }
}
