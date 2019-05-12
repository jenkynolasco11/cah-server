async function handle404(ctx, next) {
  try {
    await next()
    const { status = 404 } = ctx

    if (status === 404) ctx.throw(404)
  } catch (err) {
    console.log({ err })

    ctx.status = err.status || 500
  } finally {
    // console.log('oh wow...')
    // ctx.body = ctx.status
  }
}

export default handle404
