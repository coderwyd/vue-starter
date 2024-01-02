const process = require('node:process')

module.exports = {
  description: 'generate a component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'component name:',
      validate(value) {
        if (!value || value.trim === '') return 'name is required'

        return true
      },
    },
    {
      type: 'checkbox',
      name: 'blocks',
      message: 'Blocks:',
      choices: [
        {
          name: '<template>',
          value: 'template',
          checked: true,
        },
        {
          name: '<script>',
          value: 'script',
          checked: true,
        },
        {
          name: 'style',
          value: 'style',
          checked: true,
        },
      ],
      validate(value) {
        if (value.includes('script') || value.includes('template')) return true

        return 'View require at least a <script> or <template> tag.'
      },
    },
  ],
  actions: ({ name, blocks }) => {
    const dir = `${process.cwd()}/src/components/{{pascalCase name}}`
    const actions = [
      {
        type: 'add',
        path: `${dir}/src/{{pascalCase name}}.vue`,
        templateFile: './component/index.hbs',
        data: {
          name,
          template: blocks.includes('template'),
          script: blocks.includes('script'),
          style: blocks.includes('style'),
        },
      },
      {
        type: 'add',
        path: `${dir}/index.ts`,
        templateFile: './component/index-ts.hbs',
        data: {
          name,
        },
      },
    ]
    return actions
  },
}
