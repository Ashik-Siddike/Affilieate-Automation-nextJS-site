import ReviewForm from '@/components/admin/ReviewForm';

export default function EditReviewPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <ReviewForm id={params.id} />
    </div>
  );
}
