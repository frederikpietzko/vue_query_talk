import BeastCard from '../BeastCard.vue'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import type { MagicalBeastDto } from '@/api'
import { global, nock } from '@/tests/utils'

const beast = {
  id: 1,
  image: 'animage',
  name: 'Niffler',
  description: 'This is a descriptions',
  longDescription: 'This is a long description'
} as MagicalBeastDto
describe('Beast Card', () => {
  it('should render a beast', async () => {
    const { findByText } = render(BeastCard, {
      props: { beast },
      global
    })
    await findByText('Niffler')
  })
  it('should delete a beast', async () => {
    const { findByText } = render(BeastCard, {
      props: { beast },
      global
    })
    const deleteButton = await findByText('Delete')
    const nwc = nock.delete('/beasts/1').reply(200)
    await fireEvent.click(deleteButton)
    await waitFor(() => expect(nwc.isDone()))
  })
})
