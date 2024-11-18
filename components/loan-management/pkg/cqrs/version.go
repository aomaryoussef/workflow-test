package cqrs

type Version uint64

func (v Version) Primitive() uint64 {
	return uint64(v)
}

func (v Version) Increment() Version {
	return v + 1
}

func (v Version) Equals(n Version) bool {
	return n.Primitive() == v.Primitive()
}
