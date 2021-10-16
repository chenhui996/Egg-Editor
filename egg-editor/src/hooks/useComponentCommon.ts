import {computed} from 'vue'
import {pick} from 'lodash-es'
import {TextComponentProps} from '../defaultProps'

const useComponentCommon = (
  props: Readonly<Partial<TextComponentProps>>,
  picks: string[],
) => {
  const styleProps = computed(() => pick(props, picks))
  const handleClick = (isEdit = false) => {
    // console.log(props)
    if (props.actionType === 'url' && props.url && !isEdit) {
      window.location.href = props.url
    }
  }

  return {styleProps, handleClick}
}

export default useComponentCommon
