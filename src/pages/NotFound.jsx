import { Link } from 'react-router-dom'
import { Compass } from '@phosphor-icons/react'
import { Button, EmptyState } from '../components/ui'

export default function NotFound() {
  return (
    <div className="u-container py-12">
      <EmptyState
        icon={Compass}
        title="We cannot find that page"
        body="The link may be out of date, or the piece may have sold through. The full catalogue is still here."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button as={Link} to="/shop" size="lg">
              Shop all pieces
            </Button>
            <Button as={Link} to="/" variant="outline" size="lg">
              Back home
            </Button>
          </div>
        }
      />
    </div>
  )
}
