
                            // If odd number of images, show all but last in 2-col grid, then last one full width
                            const isOdd = block.images.length % 2 !== 0;
                            const imagesForGrid = isOdd ? block.images.slice(0, -1) : block.images;
                            const lastImage = isOdd ? block.images[block.images.length - 1] : null;

                            return (
                                <div key={i} className="my-8">
                                    <div className="grid grid-cols-2 gap-3">
                                        {imagesForGrid.map((src: string, j: number) => (
                                            <img key={j} src={src} className="h-full object-cover rounded-lg" />
                                        ))}
                                    </div>
                                    {lastImage && (
                                        <img
                                            src={lastImage}
                                            className="w-full h-full object-cover rounded-lg mt-3"
                                        />
                                    )}
                                </div>
                            );
                        }