import test from 'ava';

import { getImageDimensions} from './ImageSizeChecker';

test('should get image dimensions', async t => {
  t.deepEqual(
    await getImageDimensions('https://imgplaceholder.com/100x200'),
    {width: 100, height: 200},
  );
});
