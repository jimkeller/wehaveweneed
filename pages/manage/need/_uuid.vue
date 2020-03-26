<template>
  <Form data-source='available_items' post-type="need" :edit-uuid="this.$route.params.uuid" item-field-label="What you Have"/>
</template>

<script>
  import Form from '../../../components/form_shared'

  export default {
    data: () => ({
    }),    
	  validate ({ params }) {
	    // Must be a number
	    //return /^\d+$/.test(params.id)
	    return true;
	  },
    components: {
      Form
    },
  }
</script>