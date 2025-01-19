const Statement = async ({ params }: { params: { selectedStatement: string } }) => {
    const { selectedStatement } = await params;
    return (
      <>${selectedStatement}</>
  )
}
