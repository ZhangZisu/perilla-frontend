<template>
  <div>
    <div v-if="['bzoj', 'uoj', 'poj', 'hdu', 'loj'].includes(channel)">
      <v-text-field v-model="remote_id_num" :label="$t('id')" type="number"/>
    </div>
    <div v-else-if="['codeforces', 'atcoder'].includes(channel)">
      <v-text-field v-model="remote_id_str" :label="$t('id')"/>
    </div>
    <div v-else-if="channel === 'traditional'">
      <input type="file" multiple ref="files">
      <v-btn color="primary" @click="applyTrad" v-text="$t('apply')" :loading="trad.apply_loading"/>
      <span class="body-1">{{ trad.hint_text }}</span>
    </div>
    <z-json-editor v-model="realval"/>
  </div>
</template>

<script>
import { calcHash } from '@/utils'
import zJsonEditor from '@/components/zjsoneditor.vue'
import { request } from '@/helpers/http'
import { generateData as generateTrad } from '@/helpers/traditional'
import { showToast } from '@/swal'
import Vue from 'vue'

export default {
  name: 'dataEdit',
  components: {
    zJsonEditor
  },
  props: ['value', 'channel'],
  model: {
    prop: 'value',
    event: 'update'
  },
  data () {
    return {
      realval: {
        //
      },
      trad: {
        apply_loading: false,
        hint_text: null
      }
    }
  },
  mounted () {
    this.realval = this.value || {}
  },
  watch: {
    realval: {
      handler: function (val) {
        this.$emit('update', val)
      },
      deep: true
    },
    value: {
      handler: function (val) {
        this.realval = val || {}
      },
      deep: true
    }
  },
  computed: {
    remote_id_num: {
      get () {
        return this.realval.id
      },
      set (val) {
        Vue.set(this.realval, 'id', parseInt(val) || this.realval.id)
      }
    },
    remote_id_str: {
      get () {
        return this.realval.id
      },
      set (val) {
        Vue.set(this.realval, 'id', val || this.realval.id)
      }
    }
  },
  methods: {
    async applyTrad () {
      if (this.$refs.files && this.$refs.files.files) {
        this.trad.apply_loading = true
        try {
          let raw = await generateTrad(this.$refs.files.files)
          if (raw.spj) raw.spj.file = await this.upload(raw.spj.file)
          const all = raw.subtasks.reduce((r, c) => r + c.runcases.length, 0)
          let current = 0
          this.trad.hint_text = `${current} / ${all}`
          for (let subtask of raw.subtasks) {
            for (let runcase of subtask.runcases) {
              runcase.input = await this.upload(runcase.input)
              runcase.output = await this.upload(runcase.output)
              this.trad.hint_text = `${++current} / ${all}`
            }
          }
          this.realval = raw
          showToast('success', 'upload_finished')
        } catch (e) {
          showToast('error', 'error', e.message)
        }
        this.trad.apply_loading = false
      }
    },
    async upload (file) {
      const hash = await calcHash(file)
      try {
        await request({ url: '/api/file/provide', params: { hash } })
        const form = new FormData()
        form.append('file', file)
        await request({
          url: '/api/file/provide',
          method: 'POST',
          data: form,
          onUploadProgress: e => {
            this.currentProgress = Math.round((e.loaded * 100) / e.total)
          }
        })
      } catch (e) {
        // showToast('error', 'error', e.message)
      }
      try {
        const id = await request({
          url: '/api/file',
          params: { entry: this.$store.state.entry },
          method: 'POST',
          data: { hash, tags: ['TestData'], name: file.name }
        })
        return id
      } catch (e) {
        showToast('error', 'error', e.message)
      }
    }
  }
}
</script>
