export async function dashboard(fastify, request, reply) {
    const { id, name } = request.session.get('user');

    const [results, fields] = await fastify.mysql.query(
        'SELECT * FROM users WHERE id != ?',
        [id],
    );

    return reply.view('view/dashboard.ejs', {
        userName: name,
        users: results,
    });
}
