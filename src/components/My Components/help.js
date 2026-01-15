<div className="relative z-10 text-xl font-medium text-white drop-shadow-lg">
  {blogdetail.published ? new Date(blogdetail.published).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Not published'}
</div>P