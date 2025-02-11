const TaskId = async ({ params }: { params: { id: string } }) => {
    const {id} = await(params);

    return (
        <>TaskId Page {id}</>
    );
}

export default TaskId;