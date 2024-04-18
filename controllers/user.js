export async function dashboard(fastify, request, reply) {
    const { id } = request.session.get('user');

    const [user, userFields] = await fastify.mysql.query(
        'SELECT * FROM users WHERE id = ?',
        [id],
    );

    const [results, fields] = await fastify.mysql.query(
        'SELECT * FROM users WHERE id != ?',
        [id],
    );

    return reply.view('view/dashboard.ejs', {
        userAccount: user[0],
        users: results,
    });
}
